import mongoose from 'mongoose'
import IPatient, { IFamilyMember } from './patient.interface'
import Patient from './patient.model'
import User from '../user/user.model'

const createPatientService = async userData => {
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
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const updatePatientProfile = async (phoneNo: string, updateObj: IPatient) => {
  const user = await User.findOne({ phoneNo })
  const updatedPatient = await Patient.findByIdAndUpdate(
    user?.userId,
    {
      $set: updateObj,
    },
    { new: true },
  )
  return updatedPatient
}
const getPatientProfile = async (phoneNo: string) => {
  const user = await User.findOne({ phoneNo })
  const result = await Patient.findById(user?.userId)
  return result
}
const addFamilyMembers = async (
  phoneNo: string,
  familyMembers: IFamilyMember[],
) => {
  const user = await User.findOne({ phoneNo })
  const updatedPatient = await Patient.updateOne(
    {
      _id: user?.userId,
    },
    {
      $push: {
        familyMembers: {
          $each: familyMembers,
        },
      },
    },
    { new: true },
  )
  return updatedPatient
}
const getFamilyMembers = async (phoneNo: string) => {
  const user = await User.findOne({ phoneNo })
  const result = await Patient.findById(user?.userId).select('familyMembers')
  return result
}
const removeFamilyMember = async (phoneNo: string, memberId: string) => {
  const user = await User.findOne({ phoneNo })
  const result = await Patient.updateOne(
    {
      _id: user?.userId,
    },
    {
      $pull: {
        familyMembers: {
          _id: memberId,
        },
      },
    },
    { new: true },
  )
  return result
}
export const patientServices = {
  createPatientService,
  updatePatientProfile,
  getPatientProfile,
  addFamilyMembers,
  getFamilyMembers,
  removeFamilyMember,
}
