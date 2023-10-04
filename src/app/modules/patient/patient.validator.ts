import handleValidationError from '../../middlewares/req.validator'

import { body } from 'express-validator'

const allowedProperties = ['name', 'dateOfBirth', 'email']

// Create a custom validation rule to check for additional properties
const checkForAdditionalProperties = (value, { req }) => {
  const additionalProperties = Object.keys(req.body).filter(
    prop => !allowedProperties.includes(prop),
  )

  if (additionalProperties.length > 0) {
    throw new Error(
      `Additional properties found: ${additionalProperties.join(', ')}`,
    )
  }

  return true
}

const validatePatient = [
  body().custom(checkForAdditionalProperties),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('dateOfBirth')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Date of birth must be in YYYY-MM-DD format'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  handleValidationError,
]
export const patientValidators = { validatePatient }
