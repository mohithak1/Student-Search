
const Student = require("../models/Student");

async function createStudent(req, res) {
    try {
        const student = await Student.createStudent(req.body);

        return res.status(201).json({
            success: true,
            message: "Student added successfully.",
            data: student
        });
    } catch (error) {
        console.error("POST failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add student."
        });
    }
}

async function updateStudent(req, res) {
    try {
        const student = await Student.updateStudent(
            req.params.id,
            req.body
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully.",
            data: student
        });
    } catch (error) {
        console.error("PUT failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update student."
        });
    }
}

async function getStudents(req, res) {
    const q = req.query.q;

    if (typeof q !== "string" || !q.trim()) {
        return res.status(400).json({
            success: false,
            message: "Enter a student name or ID."
        });
    }

    try {
        const students = await Student.getStudents(q.trim());

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error("GET failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to search students."
        });
    }
}

async function deleteStudent(req, res) {
    try {
        const student = await Student.deleteStudent(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully.",
            data: student
        });
    } catch (error) {
        console.error("DELETE failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete student."
        });
    }
}

module.exports = {
    createStudent,
    updateStudent,
    getStudents,
    deleteStudent
};

// const pool = require("../config/db");

// async function createStudent(req, res) {
//     const { name, dob, email, department, city } = req.body;

//     try {
//         const result = await pool.query(
//             `INSERT INTO students (name, dob, email, department, city)
//              VALUES ($1, $2, $3, $4, $5)
//              RETURNING student_id, name, dob, email, department, city`,
//             [
//                 name,
//                 dob,
//                 email || null,
//                 department || null,
//                 city || null
//             ]
//         );

//         return res.status(201).json({
//             success: true,
//             message: "Student added successfully.",
//             data: result.rows[0]
//         });

//     } catch (error) {
//         console.error("POST failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to add student."
//         });
//     }
// }

// async function updateStudent(req, res) {
//     const studentId = req.params.id;
//     const { name, dob, email, department, city } = req.body;

//     try {
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
//                 name,
//                 dob,
//                 email || null,
//                 department || null,
//                 city || null,
//                 studentId
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student not found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Student updated successfully.",
//             data: result.rows[0]
//         });

//     } catch (error) {
//         console.error("PUT failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to update student."
//         });
//     }
// }

// async function getStudents(req, res) {
//     const q = req.query.q;

//     if (typeof q !== "string" || !q.trim()) {
//         return res.status(400).json({
//             success: false,
//             message: "Enter a student name or ID."
//         });
//     }

//     try {
//         const result = await pool.query(
//             `SELECT student_id, name, dob,
//                     EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob))::INTEGER AS age,
//                     email, department, city
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
//         console.error("GET failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to search students."
//         });
//     }
// }

// async function deleteStudent(req, res) {
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
//         console.error("DELETE failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Unable to delete student."
//         });
//     }
// }


// module.exports = { createStudent, updateStudent, getStudents, deleteStudent };
