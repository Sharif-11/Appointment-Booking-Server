import { RequestHandler } from 'express'
import { ValidationError, validationResult } from 'express-validator'
const handleValidationError: RequestHandler = (req, res, next) => {
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
export default handleValidationError
