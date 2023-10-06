"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorValidators = void 0;
const express_validator_1 = require("express-validator");
const req_validator_1 = __importDefault(require("../../middlewares/req.validator"));
const updateDoctorValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    (0, express_validator_1.body)('designation')
        .notEmpty()
        .withMessage('Designation is required')
        .isString()
        .withMessage('Designation must be a string'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('aboutMe')
        .notEmpty()
        .withMessage('About Me is required')
        .isString()
        .withMessage('About Me must be a string'),
    (0, express_validator_1.body)('academicQualifications')
        .optional({ nullable: true })
        .isArray()
        .withMessage('Academic Qualifications must be an array')
        .custom(qualifications => {
        if (qualifications) {
            for (const qualification of qualifications) {
                if (!qualification.degree ||
                    !qualification.institute ||
                    !qualification.startTime ||
                    !qualification.endTime) {
                    throw new Error('Academic Qualifications must have degree, institute, start time, and end time');
                }
            }
        }
        return true;
    }),
    req_validator_1.default,
];
exports.doctorValidators = { updateDoctorValidation };
