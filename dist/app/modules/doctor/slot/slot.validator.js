"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotValidators = void 0;
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const handleValidationError = (req, res, next) => {
    const errors = (0, express_validator_2.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'invalid request',
            errors: errors === null || errors === void 0 ? void 0 : errors.errors.map(e => e.msg),
        });
    }
    next();
};
const validateSlot = [
    (0, express_validator_1.body)('weekDay')
        .isIn([
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ])
        .withMessage('weekDay must be valid'),
    (0, express_validator_1.body)('startTime').custom(value => {
        // Check if the startTime is in 12-hour time format (e.g., 01:30 AM/PM)
        if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
            throw new Error('Start time should be in 12-hour format');
        }
        return true;
    }),
    (0, express_validator_1.body)('endTime').custom(value => {
        // Check if the endTime is in 12-hour time format (e.g., 01:30 AM/PM)
        if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
            throw new Error('End time should be in 12-hour format');
        }
        return true;
    }),
    (0, express_validator_1.body)('bookingStartTime').custom(value => {
        // Check if the bookingStartTime is in 12-hour time format (e.g., 01:30 AM/PM)
        if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
            throw new Error('Booking start time should be in 12-hour format');
        }
        return true;
    }),
    (0, express_validator_1.body)('bookingEndTime').custom(value => {
        // Check if the bookingEndTime is in 12-hour time format (e.g., 01:30 AM/PM)
        if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
            throw new Error('Booking end time should be in 12-hour format');
        }
        return true;
    }),
    (0, express_validator_1.body)('capacity')
        .isInt({ min: 5, max: 250 })
        .withMessage('Capacity must be between 5 and 250'),
    (0, express_validator_1.body)('visitingFee')
        .isInt({ min: 100, max: 2000 })
        .withMessage('Visiting fee must be between 100 and 2000'),
    handleValidationError,
];
exports.slotValidators = { validateSlot };
