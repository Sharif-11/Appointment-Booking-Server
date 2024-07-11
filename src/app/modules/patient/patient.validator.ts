import { body } from 'express-validator'
import mongoose from 'mongoose'
import handleValidationError from '../../middlewares/req.validator'

const validatePatient = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('Email is required'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of Birth is required')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('date must be in yyyy-mm-dd format'),
  // body('gender')
  //   .isIn(['male', 'female', 'others'])
  //   .withMessage('Invalid gender'),
  handleValidationError,
]

const validateObjectId = value => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ObjectId')
  }
  return true
}

const validateMongooseId = [body('id').custom(validateObjectId)]
export const patientValidators = {
  validatePatient,
  validateMongooseId,
}
