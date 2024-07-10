/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import { appointmentServices } from '../../doctor/appointment/appointment.service'
import Booking from './booking.model'
const findExistedBooking = async (appointmentId: string, patientId: string) => {
  const result = await Booking.findOne({ appointmentId, patientId })
  return result
}
const createBooking = async (
  appointmentId: string,
  patientId: string,
  problemDescription: string,
  session: mongoose.mongo.ClientSession,
) => {
  const appointment = await appointmentServices.getAppointment(appointmentId)
  if (!appointment) {
    throw new Error('Appointment with this id does not exist')
  }
  const existedBooking = await findExistedBooking(appointmentId, patientId)
  if (existedBooking) {
    throw new Error('You already booked a slot')
  }
  const bookingInfo = {
    paymentStatus: 'unpaid',
    serviceStatus: 'pending',
    appointmentId,
    patientId,
    problemDescription,
  }
  const newBooking = await Booking.create([bookingInfo], { session })
  return newBooking[0]
}
const updateBookingStatus = async (
  id: string,
  updateObj: any,
  session?: mongoose.mongo.ClientSession,
) => {
  const result = await Booking.findByIdAndUpdate(
    id,
    {
      $set: updateObj,
    },
    { new: true, session },
  )
  return result
}
const deleteBooking = async (bookingId: string) => {
  const result = await Booking.findByIdAndDelete(bookingId, { new: true })
  return result
}
const cancelBooking = async (bookingId: string) => {
  console.log({ bookingId })
  const existedBooking = await Booking.findById(bookingId)
  console.log(existedBooking)
  if (!existedBooking) {
    throw new Error('Booking does not exist')
  }
  if (existedBooking.paymentStatus === 'paid') {
    throw new Error('Paid booking can not be canceled')
  }
  const result = await Booking.findByIdAndDelete(bookingId)
  console.log({ result })
  return result
}
export const bookingServices = {
  createBooking,
  updateBookingStatus,
  findExistedBooking,
  deleteBooking,
  cancelBooking,
}
