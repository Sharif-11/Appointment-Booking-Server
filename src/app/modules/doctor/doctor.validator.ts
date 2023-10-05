import { body } from 'express-validator'
import handleValidationError from '../../middlewares/req.validator'

const updateDoctorValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),

  body('designation')
    .notEmpty()
    .withMessage('Designation is required')
    .isString()
    .withMessage('Designation must be a string'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('aboutMe')
    .notEmpty()
    .withMessage('About Me is required')
    .isString()
    .withMessage('About Me must be a string'),

  body('academicQualifications')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Academic Qualifications must be an array')
    .custom(qualifications => {
      if (qualifications) {
        for (const qualification of qualifications) {
          if (
            !qualification.degree ||
            !qualification.institute ||
            !qualification.startTime ||
            !qualification.endTime
          ) {
            throw new Error(
              'Academic Qualifications must have degree, institute, start time, and end time',
            )
          }
        }
      }
      return true
    }),

  handleValidationError,
]
export const doctorValidators = { updateDoctorValidation }
