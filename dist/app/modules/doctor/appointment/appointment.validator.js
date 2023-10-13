'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express_validator_1 = require('express-validator')
const handleValidationError = (req, res, next) => {
  const errors = (0, express_validator_1.validationResult)(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'invalid request',
      errors:
        errors === null || errors === void 0
          ? void 0
          : errors.errors.map(e => e.msg),
    })
  }
  next()
}
const appointmentValidate = [
  (0, express_validator_1.body)('slotId')
    .isMongoId()
    .withMessage('invalid slotId'),
  handleValidationError,
]
exports.default = appointmentValidate
