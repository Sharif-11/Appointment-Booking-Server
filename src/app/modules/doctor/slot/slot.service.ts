import ISlot, { OptionalSlot } from './slot.interface'
import Slot from './slot.model'

const createSlot = async (slot: ISlot) => {
  const newSlot = await Slot.create(slot)
  return newSlot
}
const getAllSlot = async () => {
  const allSlots = await Slot.find()
  return allSlots
}
const updateSlot = async (id: string, updateObject: OptionalSlot) => {
  const updatedSlot = await Slot.findByIdAndUpdate(id, updateObject)
  return updatedSlot
}
const deleteSlot = async (id: string) => {
  const deletedSlot = await Slot.findByIdAndDelete(id)
  return deletedSlot
}
export const slotServices = { createSlot, getAllSlot, updateSlot, deleteSlot }
