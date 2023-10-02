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
// const updateSlot = async (id: string, updateObject: ISlot) => {
//   const session = await mongoose.startSession()
//   const errorMessage = 'Slot update failed'
//   try {
//     await session.startTransaction()
//     const deletedSlot = await Slot.findByIdAndDelete(id, { session })
//     if (!deletedSlot) {
//       throw new Error(errorMessage)
//     }
//     const newSlot = await Slot.create([updateObject], { session })
//     if (!newSlot.length) {
//       throw new Error(errorMessage)
//     }
//     await session.commitTransaction()
//     await session.endSession()
//     return newSlot[0]
//   } catch (error) {
//     await session.abortTransaction()
//     await session.endSession()
//     throw error
//   }
// }
export const slotServices = { createSlot, getAllSlot, deleteSlot }
