
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Test the database connection at startup
pool.query("SELECT NOW()")
    .then(() => console.log("PostgreSQL connected successfully"))
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error.message);
    });

// Search students by ID or name
app.get("/api/students/search", async (req, res) => {
    const q = req.query.q;

    if (typeof q !== "string" || !q.trim()) {
        return res.status(400).json({
            success: false,
            message: "Enter a student name or ID."
        });
    }

    try {
        const result = await pool.query(
            `SELECT
                student_id,
                name,
                dob,
                EXTRACT(
                    YEAR FROM AGE(CURRENT_DATE, dob)
                )::INTEGER AS age,
                email,
                department,
                city
             FROM students
             WHERE student_id ILIKE $1
                OR name ILIKE $1
             ORDER BY name
             LIMIT 50`,
            [`%${q.trim()}%`]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error("Search failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to search students."
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
