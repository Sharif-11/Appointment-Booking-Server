import express from 'express'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import { appointmentControllers } from '../doctor/appointment/appointment.controller'
import { patientQueueControllers } from '../patient-queue/patientQueue.controller'
import { userControllers } from '../user/user.controller'
import { bookingControllers } from './booking/booking.controller'
import { patientControllers } from './patient.controller'
import { patientValidators } from './patient.validator'

const patientRoutes = express.Router()
patientRoutes.post('/login', userControllers.userLoginController)
patientRoutes.use(
  authMiddlewares.verifyTokenMiddleware,
  authMiddlewares.verifyUser('Patient'),
)
patientRoutes.post('/booking/:id', bookingControllers.createBookingController)
patientRoutes.delete(
  '/cancel-booking/:bookingId',
  bookingControllers.cancelBookingController,
)

patientRoutes.post(
  '/check-booking/:id',
  bookingControllers.checkBookingController,
)
patientRoutes.get(
  '/appointments',
  appointmentControllers.getUpcomingAppointmentsController,
)
patientRoutes.patch(
  '/profile',
  patientValidators.validatePatient,
  patientControllers.updatedPatientController,
)

patientRoutes.get(
  '/profile',

  patientControllers.getPatientProfileController,
)
patientRoutes.get('/doctor-info', patientControllers.getDoctorProfileController)
patientRoutes.get(
  '/patient-queue/:id',
  patientQueueControllers.getQueuedPatientController,
)
export default patientRoutes
