import { body } from 'express-validator'
import handleValidationError from '../../../middlewares/req.validator'

const validateServiceStatus = [
  body('serviceStatus')
    .notEmpty()
    .withMessage('service status is required')
    .isIn(['waiting', 'pending', 'in service', 'served'])
    .withMessage('service status is invalid'),
  handleValidationError,
]
export const bookingValidators = { validateServiceStatus }
