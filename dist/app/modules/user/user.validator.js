"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const express_validator_1 = require("express-validator");
const handleValidationError = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'invalid request',
            errors: errors.array().map((e) => e.msg),
        });
    }
    next();
};
// Middleware for validating the patientUser schema
const validatePatient = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('phoneNo').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email address')
        .notEmpty()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    (0, express_validator_1.body)('dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('date must be in yyyy-mm-dd format'),
    handleValidationError,
];
const validateDoctor = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email address')
        .notEmpty()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('designation').notEmpty().withMessage('Designation is required'),
    (0, express_validator_1.body)('dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('date of birth must be in yyyy-mm-dd format'),
    (0, express_validator_1.body)('phoneNo').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    (0, express_validator_1.body)('academicQualifications.*.degree')
        .notEmpty()
        .withMessage('Degree is required for all qualifications'),
    (0, express_validator_1.body)('academicQualifications.*.institute')
        .notEmpty()
        .withMessage('Institute is required for all qualifications'),
    (0, express_validator_1.body)('academicQualifications.*.startTime')
        .notEmpty()
        .withMessage('startTime is required for all qualifications'),
    (0, express_validator_1.body)('academicQualifications.*.endTime')
        .notEmpty()
        .withMessage('endTime is required for all qualifications'),
    handleValidationError,
    // Handle validation errors in your route handler
];
const validateLogin = [
    (0, express_validator_1.body)('phoneNo')
        .notEmpty()
        .withMessage('Phone number is required')
        .isString()
        .withMessage('Phone number must be a string'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string'),
    handleValidationError,
];
exports.userValidator = { validateDoctor, validateLogin, validatePatient };
