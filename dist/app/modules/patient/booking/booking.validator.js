"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidators = void 0;
const express_validator_1 = require("express-validator");
const req_validator_1 = __importDefault(require("../../../middlewares/req.validator"));
const validateServiceStatus = [
    (0, express_validator_1.body)('serviceStatus')
        .notEmpty()
        .withMessage('service status is required')
        .isIn(['waiting', 'pending', 'in service', 'served'])
        .withMessage('service status is invalid'),
    req_validator_1.default,
];
exports.bookingValidators = { validateServiceStatus };
