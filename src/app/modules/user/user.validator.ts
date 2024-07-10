import { NextFunction, Request, Response } from 'express'
import { body, ValidationError, validationResult } from 'express-validator'

const handleValidationError = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'invalid request',
      errors: errors.array().map((e: ValidationError) => e.msg),
    })
  }
  next()
}
// Middleware for validating the patientUser schema

const validatePatient = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phoneNo').notEmpty().withMessage('Phone number is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('date must be in yyyy-mm-dd format'),
  handleValidationError,
]

const validateDoctor = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('Email is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('date of birth must be in yyyy-mm-dd format'),
  body('phoneNo').notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required'),
  body('academicQualifications.*.degree')
    .notEmpty()
    .withMessage('Degree is required for all qualifications'),
  body('academicQualifications.*.institute')
    .notEmpty()
    .withMessage('Institute is required for all qualifications'),
  body('academicQualifications.*.startTime')
    .notEmpty()
    .withMessage('startTime is required for all qualifications'),
  body('academicQualifications.*.endTime')
    .notEmpty()
    .withMessage('endTime is required for all qualifications'),
  handleValidationError,
  // Handle validation errors in your route handler
]
const validateLogin = [
  body('phoneNo')
    .notEmpty()
    .withMessage('Phone number is required')
    .isString()
    .withMessage('Phone number must be a string'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  handleValidationError,
]
export const userValidator = { validateDoctor, validateLogin, validatePatient }
