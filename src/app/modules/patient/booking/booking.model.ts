import mongoose, { model } from 'mongoose'
import { Schema } from 'mongoose'
import IBooking, { BookingModel } from './booking.interface'

const bookingSchema = new Schema<IBooking>({
  appointmentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Appointment', // Replace 'Appointment' with the actual name of your Appointment model
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  paymentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Payment',
  },
  problemDescription: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    required: true,
  },
  serviceStatus: {
    type: String,
    enum: ['in service', 'pending', 'waiting', 'served'],
    required: true,
  },
})
const Booking = model<IBooking, BookingModel>('booking', bookingSchema)
export default Booking
