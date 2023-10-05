import mongoose from 'mongoose'
import Appointment from '../../doctor/appointment/appointment.model'
import { daysOfWeek } from '../../doctor/doctor.constant'
import User from '../../user/user.model'
import Booking from './booking.model'
import Patient from '../patient.model'

const createBooking = async (
  appointmentId: string,
  patientId: string,
  problemDescription?: string,
) => {
  const currentDate = new Date()
  const today = daysOfWeek[currentDate.getDay()]
  const appointment = await Appointment.findById(appointmentId)
  if (!appointment) {
    throw new Error("Appointment with this id doesn't exist")
  }
  const patient = await Patient.findById(patientId)
  if (!patient) {
    throw new Error('Patient with this id does not exist')
  }

  const appointmentDay = daysOfWeek[new Date(appointment.date).getDay()]
  if (
    today !== appointmentDay ||
    appointment.status !== 'pending' ||
    appointment.remainingSlots <= 0
  ) {
    throw new Error(`You can't book a slot for this appointment`)
  }

  const existedBooking = await Booking.findOne({ patientId, appointmentId })
  if (existedBooking) {
    throw new Error('You already booked a slot')
  }
  const bookingInfo = {
    patientId,
    appointmentId: appointment._id,
    problemDescription,
    paymentStatus: 'unpaid',
    serviceStatus: 'pending',
  }
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const newBooking = await Booking.create([bookingInfo], { session })
    if (!newBooking.length) {
      throw new Error('booking failed')
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointment._id.toString(),
      {
        $inc: {
          remainingSlots: -1,
        },
      },
      { new: true },
    ).session(session)
    if (!updatedAppointment) {
      throw new Error('booking failed')
    }
    await session.commitTransaction()
    await session.endSession()
    return {
      appointment: updatedAppointment,
      data: newBooking,
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const checkBooking = async (appointmentId: string, phoneNo: string) => {
  const user = await User.findOne({ phoneNo })
  const existedBooking = await Booking.findOne({
    appointmentId,
    userId: user._id,
  })
  return existedBooking
}

export const bookingServices = {
  createBooking,
  checkBooking,
}
