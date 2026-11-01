
const pool = require("../config/db");
const queries = require("../queries/studentQueries");

async function createStudent(student) {
    const { name, dob, email, department, city } = student;

    const result = await pool.query(queries.createStudent, [
        name, dob, email || null, department || null, city || null
    ]);

    return result.rows[0];
}

async function updateStudent(id, student) {
    const { name, dob, email, department, city } = student;

    const result = await pool.query(queries.updateStudent, [
        name, dob, email || null, department || null, city || null, id
    ]);

    return result.rows[0] || null;
}

async function getStudents(searchTerm) {
    const result = await pool.query(queries.getStudents, [
        `%${searchTerm}%`
    ]);

    return result.rows;
}

async function deleteStudent(id) {
    const result = await pool.query(queries.deleteStudent, [id]);

    return result.rows[0] || null;
}

module.exports = {
    createStudent,
    updateStudent,
    getStudents,
    deleteStudent
};
