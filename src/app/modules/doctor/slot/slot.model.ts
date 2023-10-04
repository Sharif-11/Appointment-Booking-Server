import mongoose, { Schema } from 'mongoose'
import ISlot from './slot.interface'
import { SlotModel } from './slot.interface'
import { slotUtilityFuntions } from './slot.utils'

const slotSchema = new Schema<ISlot>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

// Define a pre-save hook to check for overlapping slots
slotSchema.pre('save', async function (next) {
  const { startTime, endTime, bookingStartTime, bookingEndTime, weekDay } = this
  const { status, message, data } =
    await slotUtilityFuntions.slotModelValidator(
      weekDay,
      startTime,
      endTime,
      bookingStartTime,
      bookingEndTime,
    )
  if (!status) {
    throw new Error(message as string)
  }
  this.startTime = data.startTime
  this.endTime = data.endTime
  this.bookingStartTime = data.bookingStartTime
  this.bookingEndTime = data.bookingEndTime
  next()
})
slotSchema.post('find', function (docs, next) {
  if (Array.isArray(docs)) {
    // Loop through the documents and convert the time format
    docs.forEach(doc => {
      if (doc.startTime) {
        doc.startTime = slotUtilityFuntions.convertTo12HourFormat(doc.startTime)
      }
      if (doc.endTime) {
        doc.endTime = slotUtilityFuntions.convertTo12HourFormat(doc.endTime)
      }
      if (doc.bookingStartTime) {
        doc.bookingStartTime = slotUtilityFuntions.convertTo12HourFormat(
          doc.bookingStartTime,
        )
      }
      if (doc.bookingEndTime) {
        doc.bookingEndTime = slotUtilityFuntions.convertTo12HourFormat(
          doc.bookingEndTime,
        )
      }
    })
  } else {
    // Single document case
    if (docs.startTime) {
      docs.startTime = slotUtilityFuntions.convertTo12HourFormat(docs.startTime)
    }
    if (docs.endTime) {
      docs.endTime = slotUtilityFuntions.convertTo12HourFormat(docs.endTime)
    }
    if (docs.bookingStartTime) {
      docs.bookingStartTime = slotUtilityFuntions.convertTo12HourFormat(
        docs.bookingStartTime,
      )
    }
    if (docs.bookingEndTime) {
      docs.bookingEndTime = slotUtilityFuntions.convertTo12HourFormat(
        docs.bookingEndTime,
      )
    }
  }
  next()
})

const Slot = mongoose.model<ISlot, SlotModel>('Slot', slotSchema)

export default Slot
