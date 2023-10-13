'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const globalErrorHandler = (err, req, res, next) => {
  // Handle the error here, e.g., logging, responding with an error message, etc.
  res.status(500).json({
    status: false,
    message: err === null || err === void 0 ? void 0 : err.message,
    errors: err,
  })
}
exports.default = globalErrorHandler
