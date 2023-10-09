import mongoose from 'mongoose'
import { daysOfWeek } from '../doctor.constant'
import Slot from '../slot/slot.model'
import Appointment from './appointment.model'
import formatDate from './appointment.utils'
import Booking from '../../patient/booking/booking.model'

const createAppointment = async (id: string) => {
  const slot = await Slot.findById(id)
  if (!slot) {
    throw new Error("slot with this id don't exists")
  }
  const { capacity } = slot
  const currentDate = new Date()
  const today = daysOfWeek[currentDate.getDay()]
  if (today !== slot.weekDay) {
    throw new Error(`You can't create a appointment for this slot now`)
  }
  const appointmentData = {
    slotId: slot._id,
    date: formatDate(currentDate),
    remainingSlots: capacity,
    status: 'pending',
  }
  const newAppointment = await Appointment.create(appointmentData)
  return newAppointment
}
const startAppointment = async (id: string) => {
  const appointment = await Appointment.findById(id)

  if (!appointment) {
    throw new Error("Appointment with this id don't exists")
  }
  const currentDate = new Date()
  const today = daysOfWeek[currentDate.getDay()]
  const weekDay = daysOfWeek[new Date(appointment.date).getDay()]
  if (today !== weekDay) {
    throw new Error(`You can't start this appointment now`)
  }
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointment._id,
      {
        $set: {
          status: 'running',
        },
      },
      { new: true },
    ).session(session)
    if (!updatedAppointment) {
      throw new Error('starting appointment failed')
    }
    await Booking.updateMany(
      {},
      {
        $set: {
          serviceStatus: 'waiting',
        },
      },
    ).session(session)
    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const closeAppointment = async (id: string) => {
  const appointment = await Appointment.findById(id)
  if (!appointment) {
    throw new Error(`Appointment with this id doesn't exist`)
  }
  if (appointment.status === 'pending') {
    throw new Error(`This appointment doesn't started yet`)
  }
  if (appointment.status === 'closed') {
    throw new Error('This appoinment closed already')
  }
  const unservedPatient = await Booking.findOne({
    appointmentId: appointment._id,
    serviceStatus: {
      $in: ['waiting', 'in service'],
    },
  })
  if (unservedPatient) {
    throw new Error('There are some patient yet to be served')
  }
  const closedAppointment = await Appointment.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'closed',
      },
    },
    { new: true },
  )
  return closedAppointment
}
const deleteAppoinment = async (id: string) => {
  const appoinment = await Appointment.findById(id)
  if (!appoinment) {
    throw new Error(`Appointment with this id doesn't exist`)
  }
  if (appoinment.status === 'running') {
    throw new Error(`Running appointment can't be deleted`)
  } else if (appoinment.status === 'closed') {
    const result = await Appointment.findByIdAndDelete(id)
    return result
  } else {
    const pendingPatient = await Booking.findOne({
      serviceStatus: 'pending',
    })
    if (pendingPatient) {
      throw new Error(
        `Appoinment which has any booked patient can't be deleted`,
      )
    }
    const result = await Appointment.findByIdAndDelete(id)
    return result
  }
}
const getAppointments = async () => {
  const appointments = await Appointment.find({}).sort({
    createdAt: -1,
  })
  return appointments
}
const getUpcomingAppointment = async (date: string) => {
  const result = await Appointment.find({
    date: formatDate(new Date(date)),
  }).sort({ createdAt: -1 })
  return result
}
const getStartableAppointments = async (date: string) => {
  const result = await Appointment.aggregate([
    {
      $match: {
        date,
        status: 'pending',
      },
    },
    {
      $lookup: {
        from: 'slots',
        localField: 'slotId',
        foreignField: '_id',
        as: 'matchedData',
      },
    },
    {
      $unwind: '$matchedData',
    },
    {
      $project: {
        _id: 1,
        startTime: '$matchedData.startTime',
        endTime: '$matchedData.endTime',
        bookingStartTime: '$matchedData.bookingStartTime',
        bookingEndTime: '$matchedData.bookingEndTime',
      },
    },
  ])
  return result
}
const getDeletableAppointments = async () => {
  const result = await Appointment.aggregate([
    {
      $match: {
        status: {
          $in: ['pending', 'closed'],
        },
      },
    },
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'appointmentId',
        as: 'data',
      },
    },
    {
      $match: {
        $or: [
          {
            status: 'pending',
            data: [],
          },
          {
            status: 'closed',
          },
        ],
      },
    },
    {
      $project: { data: 0 },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ])
  return result
}
export const appointmentServices = {
  createAppointment,
  startAppointment,
  closeAppointment,
  deleteAppoinment,
  getAppointments,
  getUpcomingAppointment,
  getStartableAppointments,
  getDeletableAppointments,
}
