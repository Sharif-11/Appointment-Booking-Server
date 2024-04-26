import mongoose from 'mongoose'
import Doctor from '../doctor/doctor.model'
import User from '../user/user.model'
import IPatient from './patient.interface'
import Patient from './patient.model'

const createPatientService = async userData => {
  const role = 'Patient'
  const { name, email, phoneNo, password, dateOfBirth } = userData
  const user = { phoneNo, password, role }
  const patient: IPatient = { name, email, dateOfBirth }
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

const getDoctorProfile = async () => {
  const doctor = Doctor.findOne({}).select('-_id')
  return doctor
}

export const patientServices = {
  createPatientService,
  updatePatientProfile,
  getPatientProfile,
  getDoctorProfile,
}
