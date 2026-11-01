
const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/authController");
const validateLogin = require("../validators/loginValidator");
const handleValidation = require("../middlewares/handleValidation");

router.post("/login",validateLogin,handleValidation,loginAdmin);

module.exports = router;
