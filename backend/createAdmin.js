
require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter admin username: ", async (username) => {
    rl.question("Enter admin password: ", async (password) => {
        try {
            username = username.trim();

            if (!username || !password) {
                console.log("Username and password are required.");
                return;
            }

            if (password.length < 12) {
                console.log("Use a password with at least 12 characters.");
                return;
            }

            const passwordHash = await bcrypt.hash(password, 12);

            await pool.query(
                `INSERT INTO admins (username, password_hash)
                 VALUES ($1, $2)`,
                [username, passwordHash]
            );

            console.log("Admin account created successfully.");

        } catch (error) {
            if (error.code === "23505") {
                console.log("That username already exists.");
            } else {
                console.error("Unable to create admin:", error.message);
            }
        } finally {
            rl.close();
            await pool.end();
        }
    });
});
