import express from 'express'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import { bookingControllers } from './booking/booking.controller'
import { appointmentControllers } from '../doctor/appointment/appointment.controller'
import { patientControllers } from './patient.controller'

const patientRoutes = express.Router()
patientRoutes.use(
  authMiddlewares.verifyTokenMiddleware,
  authMiddlewares.verifyUser('patient'),
)
patientRoutes.post('/booking/:id', bookingControllers.createBookingController)
patientRoutes.get('/booking/:id', bookingControllers.checkBookingController)
patientRoutes.get(
  '/appointments',
  appointmentControllers.getUpcomingAppointmentsController,
)
patientRoutes.patch('/profile', patientControllers.updatedPatientController)
patientRoutes.get('/profile', patientControllers.getPatientProfileController)
export default patientRoutes
