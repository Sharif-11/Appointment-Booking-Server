import { daysOfWeek } from '../doctor.constant'
import Slot from '../slot/slot.model'
import Appointment from './appointment.model'

const createAppointment = async (id: string, date: string) => {
  const slot = await Slot.findById(id)
  if (!slot) {
    throw new Error("slot with this id don't exists")
  }
  const { capacity } = slot
  const givenDay = daysOfWeek[new Date(date).getDay()]
  const today = daysOfWeek[new Date().getDay()]
  if (today !== givenDay || givenDay !== slot.weekDay) {
    throw new Error(`You can't create a slot currently`)
  }
  const appointmentData = {
    slotId: slot._id,
    date,
    remainingSlots: capacity,
    status: 'pending',
  }
  const newAppointment = await Appointment.create(appointmentData)
  return newAppointment
}
export const appointmentServices = { createAppointment }
