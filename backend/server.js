
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const requestLogger = require("./middlewares/logger");
const apiLimiter = require("./middlewares/rateLimiter");

const studentRoutes = require("./routes/student.route");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", apiLimiter);

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const requestLogger = require("./middleware/logger");
// const apiLimiter = require("./middleware/rateLimiter");
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/api",apiLimiter);
// app.use(requestLogger);


// // Import and register student routes
// const getStudents = require("./routes/getStudents");
// app.use("/api/students", getStudents);

// const postStudent = require("./routes/postStudent");
// app.use("/api/students", postStudent);

// const putStudent = require("./routes/putStudent");
// app.use("/api/students", putStudent);

// const deleteStudent = require("./routes/deleteStudent");
// app.use("/api/students", deleteStudent);

// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

// // Start server
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // PostgreSQL connection
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT || 5432),
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
// });

// // Test the database connection at startup
// pool.query("SELECT NOW()")
//     .then(() => console.log("PostgreSQL connected successfully"))
//     .catch((error) => {
//         console.error("PostgreSQL connection failed:", error.message);
//     });

// // Search students by ID or name
// app.get("/api/students/search", async (req, res) => {
//     const q = req.query.q;

//     if (typeof q !== "string" || !q.trim()) {
//         return res.status(400).json({
//             success: false,
//             message: "Enter a student name or ID."
//         });
//     }

//     try {
//         const result = await pool.query(
//             `SELECT
//                 student_id,
//                 name,
//                 dob,
//                 EXTRACT(
//                     YEAR FROM AGE(CURRENT_DATE, dob)
//                 )::INTEGER AS age,
//                 email,
//                 department,
//                 city
//              FROM students
//              WHERE student_id ILIKE $1
//                 OR name ILIKE $1
//                 OR city ILIKE $1
//              ORDER BY name
//              LIMIT 50`,
//             [`%${q.trim()}%`]
//         );

//         return res.status(200).json({
//             success: true,
//             count: result.rows.length,
//             data: result.rows
//         });
//     } catch (error) {
//         console.error("Search failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to search students."
//         });
//     }
// });

// app.post("/api/students", async (req, res) => {
//     const {
//         student_id,
//         name,
//         dob,
//         email,
//         department,
//         city
//     } = req.body || {};

//     // 1. Validate required fields
//     if (
//         typeof name !== "string" ||
//         !name.trim() ||
//         typeof dob !== "string" ||
//         !dob.trim()
//     ) {
//         return res.status(400).json({
//             success: false,
//             message: "Student ID, name, and date of birth are required."
//         });
//     }

//     // 2. Validate date format
//     if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
//         return res.status(400).json({
//             success: false,
//             message: "Date of birth must use YYYY-MM-DD format."
//         });
//     }

//     try {
//         // 3. Insert the student into PostgreSQL
//         const result = await pool.query(
//             `INSERT INTO students
//                 (name, dob, email, department, city)
//              VALUES ($1, $2, $3, $4, $5)
//              RETURNING student_id, name, dob, email, department, city`,
//             [
//                 name.trim(),
//                 dob,
//                 email || null,
//                 department || null,
//                 city || null
//             ]
//         );

//         // 4. Send the created student back to the client
//         return res.status(201).json({
//             success: true,
//             message: "Student added successfully.",
//             data: result.rows[0]
//         });

//     } catch (error) {
//         // Duplicate primary key
//         if (error.code === "23505") {
//             return res.status(409).json({
//                 success: false,
//                 message: "A student with this ID already exists."
//             });
//         }

//         // Invalid date rejected by PostgreSQL
//         if (error.code === "22007" || error.code === "22008") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide a valid date of birth."
//             });
//         }

//         console.error("Add student failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to add student."
//         });
//     }
// });

// app.put("/api/students/:id", async (req, res) => {
//     const studentId = req.params.id;

//     const {
//         name,
//         dob,
//         email,
//         department,
//         city
//     } = req.body || {};

//     // 1. Validate required fields
//     if (
//         typeof name !== "string" ||
//         !name.trim() ||
//         typeof dob !== "string" ||
//         !dob.trim()
//     ) {
//         return res.status(400).json({
//             success: false,
//             message: "Name and date of birth are required."
//         });
//     }

//     // 2. Validate date format
//     if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
//         return res.status(400).json({
//             success: false,
//             message: "Date of birth must use YYYY-MM-DD format."
//         });
//     }

//     try {
//         // 3. Update the existing student
//         const result = await pool.query(
//             `UPDATE students
//              SET name = $1,
//                  dob = $2,
//                  email = $3,
//                  department = $4,
//                  city = $5
//              WHERE student_id = $6
//              RETURNING student_id, name, dob, email, department, city`,
//             [
//                 name.trim(),
//                 dob,
//                 email || null,
//                 department || null,
//                 city || null,
//                 studentId
//             ]
//         );

//         // 4. Check whether the student exists
//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student not found."
//             });
//         }

//         // 5. Return the updated record
//         return res.status(200).json({
//             success: true,
//             message: "Student updated successfully.",
//             data: result.rows[0]
//         });

//     } catch (error) {
//         if (error.code === "22007" || error.code === "22008") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide a valid date of birth."
//             });
//         }

//         console.error("Update student failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to update student."
//         });
//     }
// });

// app.delete("/api/students/:id", async (req, res) => {
//     const studentId = req.params.id;

//     try {
//         const result = await pool.query(
//             `DELETE FROM students
//              WHERE student_id = $1
//              RETURNING student_id, name`,
//             [studentId]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student not found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Student deleted successfully.",
//             data: result.rows[0]
//         });

//     } catch (error) {
//         console.error("Delete student failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to delete student."
//         });
//     }
// });



// // Start server
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
