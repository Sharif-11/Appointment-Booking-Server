import mongoose from 'mongoose'
import Doctor from './doctor.model'
import User from '../user/user.model'
import IDoctor from './doctor.interface'

const createDoctorService = async userData => {
  const role = 'doctor'
  const { phoneNo, password, ...doctor } = userData
  console.log({ doctor })
  const user = { phoneNo, password, role }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const newDoctor = await Doctor.create([doctor], { session })
    if (!newDoctor.length) {
      throw new Error('doctor creation failed')
    }
    user.userId = newDoctor[0]._id
    const newUser = await User.create([user], { session })
    if (!newUser.length) {
      throw new Error('user creation failed')
    }
    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const updateDoctorService = async (phoneNo: string, updateObj: IDoctor) => {
  const user = await User.findOne({ phoneNo })
  console.log(user?.userId)
  const result = await Doctor.findByIdAndUpdate(
    user?.userId,
    {
      $set: updateObj,
    },
    { new: true },
  )
  return result
}
export const doctorServices = { createDoctorService, updateDoctorService }
