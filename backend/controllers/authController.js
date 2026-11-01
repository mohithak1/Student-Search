const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function loginAdmin(req, res) {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT admin_id, username, password_hash
             FROM admins
             WHERE username = $1`,
            [username.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const admin = result.rows[0];

        const passwordMatches = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        const token = jwt.sign(
            {
                adminId: admin.admin_id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token
        });

    } catch (error) {
        console.error("Admin login failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in."
        });
    }
}

module.exports = { loginAdmin };
