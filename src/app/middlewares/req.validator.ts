import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
const handleValidationError: RequestHandler = (req, res, next) => {
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
export default handleValidationError
