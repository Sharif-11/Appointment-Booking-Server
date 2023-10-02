import { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import { validationResult } from 'express-validator'
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
const validateSlot = [
  body('weekDay')
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
  body('startTime').custom(value => {
    // Check if the startTime is in 12-hour time format (e.g., 01:30 AM/PM)
    if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
      throw new Error('Start time should be in 12-hour format')
    }
    return true
  }),

  body('endTime').custom(value => {
    // Check if the endTime is in 12-hour time format (e.g., 01:30 AM/PM)
    if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
      throw new Error('End time should be in 12-hour format')
    }
    return true
  }),

  body('bookingStartTime').custom(value => {
    // Check if the bookingStartTime is in 12-hour time format (e.g., 01:30 AM/PM)
    if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
      throw new Error('Booking start time should be in 12-hour format')
    }
    return true
  }),

  body('bookingEndTime').custom(value => {
    // Check if the bookingEndTime is in 12-hour time format (e.g., 01:30 AM/PM)
    if (!/^([0-9]{2}):([0-9]{2}) (AM|PM)$/.test(value)) {
      throw new Error('Booking end time should be in 12-hour format')
    }
    return true
  }),

  body('capacity')
    .isInt({ min: 5, max: 250 })
    .withMessage('Capacity must be between 5 and 250'),

  body('visitingFee')
    .isInt({ min: 100, max: 2000 })
    .withMessage('Visiting fee must be between 100 and 2000'),
  handleValidationError,
]
export const slotValidators = { validateSlot }
