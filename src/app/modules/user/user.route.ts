import express from 'express'
import { userValidator } from './user.validator'
import { doctorControllers } from '../doctor/doctor.controller'
import { patientControllers } from '../patient/patient.controller'
import { userControllers } from './user.controller'
import { authMiddlewares } from '../../middlewares/auth.middleware'
const userRoutes = express.Router()
userRoutes.post(
  '/doctor',
  userValidator.validateDoctor,
  doctorControllers.createDoctorController,
)
userRoutes.post(
  '/patient',
  userValidator.validatePatient,
  patientControllers.createPatientController,
)
userRoutes.post(
  '/login',
  userValidator.validateLogin,
  userControllers.loginController,
)
userRoutes.get('/login', userControllers.checkLoginController)
userRoutes.patch(
  '/password',
  authMiddlewares.verifyTokenMiddleware,
  userControllers.updatePasswordController,
)
export default userRoutes
