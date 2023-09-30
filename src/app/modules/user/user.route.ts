import express from 'express'
import { userValidator } from './user.validator'
import { doctorControllers } from '../doctor/doctor.controller'
import { patientControllers } from '../patient/patient.controller'
const userRoutes = express.Router()
userRoutes.post(
  '/create-doctor',
  userValidator.validateDoctor,
  doctorControllers.createDoctorController,
)
userRoutes.post(
  '/create-patient',
  userValidator.validatePatient,
  patientControllers.createPatientController,
)
export default userRoutes
