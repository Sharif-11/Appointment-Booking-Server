import mongoose from 'mongoose'

const stringToObjectId = (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id)
  return objectId
}
export const utilityFunction = { stringToObjectId }
