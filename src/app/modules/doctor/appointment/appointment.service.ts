import { daysOfWeek } from '../doctor.constant'
import Slot from '../slot/slot.model'
import Appointment from './appointment.model'
import formatDate from './appointment.utils'

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
  const slot = await Slot.findById(id)

  if (!slot) {
    throw new Error("slot with this id don't exists")
  }
  const currentDate = new Date()
  const today = daysOfWeek[currentDate.getDay()]
  if (today !== slot.weekDay) {
    throw new Error(`You can't start this appointment now`)
  }
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    {
      status: 'running',
    },
    { new: true },
  )
  return updatedAppointment
}
const bookAppointment = async (id: string) => {
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    {
      $inc: {
        remainingSlots: -1,
      },
    },
    { new: true },
  )
  return updatedAppointment
}
export const appointmentServices = {
  createAppointment,
  startAppointment,
  bookAppointment,
}
