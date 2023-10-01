import { ErrorRequestHandler } from 'express'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Handle the error here, e.g., logging, responding with an error message, etc.
  res.status(500).json({
    status: false,
    message: err?.message,
    errors: err,
  })
}
export default globalErrorHandler
