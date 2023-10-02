import mongoose, { Schema } from 'mongoose'
import ISlot from './slot.interface'
import { SlotModel } from './slot.interface'
import { slotUtilityFuntions } from './slot.utils'

const slotSchema = new Schema<ISlot>({
  weekDay: {
    type: String,
    enum: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  bookingStartTime: {
    type: String,
    required: true,
  },
  bookingEndTime: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 5,
    max: 250,
  },
  visitingFee: {
    type: Number,
    required: true,
    min: 100,
    max: 2000,
  },
})

// Define a pre-save hook to check for overlapping slots
slotSchema.pre('save', async function (next) {
  let { startTime, endTime, bookingStartTime, bookingEndTime } = this
  const { weekDay } = this
  startTime = slotUtilityFuntions.convertTo24HourFormat(startTime)
  endTime = slotUtilityFuntions.convertTo24HourFormat(endTime)
  bookingStartTime = slotUtilityFuntions.convertTo24HourFormat(bookingStartTime)
  bookingEndTime = slotUtilityFuntions.convertTo24HourFormat(bookingEndTime)
  if (endTime <= startTime) {
    throw new Error('startTime must be less than endTime')
  } else if (bookingEndTime <= bookingStartTime) {
    throw new Error('bookingStartTime must be less than bookingEndTime')
  } else if (bookingEndTime > startTime) {
    throw new Error('bookingEndTime must be less than or equal to startTime')
  }
  // Check if there is any slot with the same weekDay and overlapping time
  const overlappingSlot = await mongoose.models.Slot.findOne({
    weekDay,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
    ],
  })

  if (overlappingSlot) {
    const err = new Error('Slot is overlapped with already existed slot')
    throw err
  }
  this.startTime = startTime
  this.endTime = endTime
  this.bookingStartTime = bookingStartTime
  this.bookingEndTime = bookingEndTime
  next()
})

const Slot = mongoose.model<ISlot, SlotModel>('Slot', slotSchema)

export default Slot
