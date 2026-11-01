
const { body } = require("express-validator");

const validateStudent = [
    body("name")
        .isString()
        .withMessage("Name must be a string.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters."),

    body("dob")
        .isString()
        .withMessage("Date of birth must be a string.")
        .bail()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("Enter a valid date in YYYY-MM-DD format.")
        .bail()
        .custom((value) => {
            if (value > new Date().toISOString().slice(0, 10)) {
                throw new Error("Date of birth cannot be in the future.");
            }
            return true;
        }),

    body("email")
        .optional({ values: "null" })
        .isString()
        .withMessage("Email must be a string.")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address.")
        .isLength({ max: 150 })
        .withMessage("Email must not exceed 150 characters."),

    body("department")
        .optional({ values: "null" })
        .isString()
        .withMessage("Department must be a string.")
        .bail()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Department must not exceed 100 characters."),

    body("city")
        .optional({ values: "null" })
        .isString()
        .withMessage("City must be a string.")
        .bail()
        .trim()
        .isLength({ max: 100 })
        .withMessage("City must not exceed 100 characters.")
];

module.exports = validateStudent;
