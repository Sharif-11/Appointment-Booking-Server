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
const appointmentValidate = [
  body('slotId').isMongoId().withMessage('invalid slotId'),
  handleValidationError,
]
export default appointmentValidate
