import mongoose from 'mongoose'
import ISlot from './slot.interface'
import Slot from './slot.model'

const createSlot = async (slot: ISlot) => {
  const newSlot = await Slot.create(slot)
  return newSlot
}
const getAllSlot = async () => {
  const allSlots = await Slot.find()
  return allSlots
}

const deleteSlot = async (id: string) => {
  const deletedSlot = await Slot.findByIdAndDelete(id)
  return deletedSlot
}
const getSlots = async (weekDay: string) => {
  const result = await Slot.find({ weekDay })
  return result
}
export const slotServices = { createSlot, getAllSlot, deleteSlot, getSlots }
