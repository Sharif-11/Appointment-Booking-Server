"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const handleValidationError = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'invalid request',
            errors: errors.array().map((e) => e.msg),
        });
    }
    next();
};
exports.default = handleValidationError;
