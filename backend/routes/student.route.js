
const express = require("express");
const router = express.Router();

const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const authenticateToken = require("../middlewares/authenticateToken");
const validateStudent = require("../validators/studentValidator");
const handleValidation = require("../middlewares/handleValidation");

// Search students
router.get("/search", authenticateToken, getStudents);

// Create a student
router.post("/", authenticateToken, validateStudent, handleValidation, createStudent);

// Update a student
router.put("/:id", authenticateToken, validateStudent, handleValidation, updateStudent);

// Delete a student
router.delete("/:id", authenticateToken, deleteStudent);

module.exports = router;
