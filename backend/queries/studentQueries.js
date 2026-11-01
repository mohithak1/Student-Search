
const createStudent = `
    INSERT INTO students (name, dob, email, department, city)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING student_id, name, dob, email, department, city
`;

const updateStudent = `
    UPDATE students
    SET name = $1, dob = $2, email = $3,
        department = $4, city = $5
    WHERE student_id = $6
    RETURNING student_id, name, dob, email, department, city
`;

const getStudents = `
    SELECT student_id, name, dob,
           EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob))::INTEGER AS age,
           email, department, city
    FROM students
    WHERE student_id ILIKE $1
       OR name ILIKE $1
       OR city ILIKE $1
    ORDER BY name
    LIMIT 50
`;

const deleteStudent = `
    DELETE FROM students
    WHERE student_id = $1
    RETURNING student_id, name
`;

module.exports = {
    createStudent,
    updateStudent,
    getStudents,
    deleteStudent
};
