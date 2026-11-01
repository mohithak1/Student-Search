
const { body } = require("express-validator");

const validateLogin = [
    body("username")
        .isString()
        .withMessage("Username must be a string.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ max: 50 })
        .withMessage("Username must not exceed 50 characters."),

    body("password")
        .isString()
        .withMessage("Password must be a string.")
        .bail()
        .notEmpty()
        .withMessage("Password is required.")
];

module.exports = validateLogin;
