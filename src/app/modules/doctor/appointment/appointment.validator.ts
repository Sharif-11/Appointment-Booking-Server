import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
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
      errors: errors?.errors.map(e => e.msg),
    })
  }
  next()
}
const appointmentValidate = [
  body('slotId').isMongoId().withMessage('invalid slotId'),
  body('date').isDate(),
  handleValidationError,
]
export default appointmentValidate
