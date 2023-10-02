import { Schema, model } from 'mongoose'
import IAppointment, { AppointmentModel } from './appointment.interface'

const appointmentSchema = new Schema<IAppointment>({
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
})

const Appointment = model<IAppointment, AppointmentModel>(
  'appointment',
  appointmentSchema,
)
export default Appointment
