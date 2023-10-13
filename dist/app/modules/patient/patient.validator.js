'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.patientValidators = void 0
const mongoose_1 = __importDefault(require('mongoose'))
const req_validator_1 = __importDefault(
  require('../../middlewares/req.validator'),
)
const express_validator_1 = require('express-validator')
const validatePatient = [
  (0, express_validator_1.body)('name')
    .notEmpty()
    .withMessage('Name is required'),
  (0, express_validator_1.body)('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('Email is required'),
  (0, express_validator_1.body)('dateOfBirth')
    .notEmpty()
    .withMessage('Date of Birth is required')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('date must be in yyyy-mm-dd format'),
  (0, express_validator_1.body)('gender')
    .isIn(['male', 'female', 'others'])
    .withMessage('Invalid gender'),
  req_validator_1.default,
]
const validateObjectId = value => {
  if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ObjectId')
  }
  return true
}
const validateMongooseId = [
  (0, express_validator_1.body)('id').custom(validateObjectId),
]
exports.patientValidators = {
  validatePatient,
  validateMongooseId,
}
