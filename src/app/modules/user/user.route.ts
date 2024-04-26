import express from 'express'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import { doctorControllers } from '../doctor/doctor.controller'
import { patientControllers } from '../patient/patient.controller'
import { userControllers } from './user.controller'
import { userValidator } from './user.validator'
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
userRoutes.post('/logout', userControllers.logoutController)
userRoutes.patch(
  '/password',
  authMiddlewares.verifyTokenMiddleware,
  userControllers.updatePasswordController,
)
export default userRoutes
