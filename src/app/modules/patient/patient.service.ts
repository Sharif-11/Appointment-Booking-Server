import mongoose from 'mongoose'
import IPatient from './patient.interface'
import Patient from './patient.model'
import User from '../user/user.model'
import IUser from '../user/user.interface'

const createPatientService = async (userData: Promise<IUser>) => {
  const role = 'patient'
  const { name, email, phoneNo, password, dateOfBirth, familyMembers } =
    userData
  const user = { phoneNo, password, role }
  const patient: IPatient = { name, email, dateOfBirth, familyMembers }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const newPatient = await Patient.create([patient], { session })

    if (!newPatient.length) {
      throw new Error('patient creation failed')
    }
    user.userId = newPatient[0]._id
    const newUser = await User.create([user], { session })
    if (!newUser.length) {
      throw new Error('user creation failed')
    }
    await session.commitTransaction()
    await session.endSession()
    return newUser[0]
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()

    throw error
  }
}
export const patientServices = { createPatientService }
