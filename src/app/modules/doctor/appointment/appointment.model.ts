import { Schema, model } from 'mongoose'
import IAppointment, { AppointmentModel } from './appointment.interface'
import formatDate from './appointment.utils'

const appointmentSchema = new Schema<IAppointment>(
  {
    slotId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Slot',
    },
    date: {
      type: String,
      required: true,
    },
    remainingSlots: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'closed'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)
appointmentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const appoinment = this
  const existedAppointment = await Appointment.findOne({
    slotId: appoinment.slotId,
    date: formatDate(new Date()),
  })
  if (existedAppointment) {
    next(new Error('Appointment for this date with this slotId already exist'))
  } else {
    next()
  }
})
const Appointment = model<IAppointment, AppointmentModel>(
  'appointment',
  appointmentSchema,
)
export default Appointment
