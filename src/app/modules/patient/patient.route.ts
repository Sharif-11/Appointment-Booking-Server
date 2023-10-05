import express from 'express'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import { bookingControllers } from './booking/booking.controller'
import { appointmentControllers } from '../doctor/appointment/appointment.controller'
import { patientControllers } from './patient.controller'
import { patientValidators } from './patient.validator'
import handleValidationError from '../../middlewares/req.validator'

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
patientRoutes.patch(
  '/profile',
  patientValidators.validatePatient,
  patientControllers.updatedPatientController,
)
patientRoutes.patch(
  '/family-members',
  patientValidators.validateFamilyMembers,
  handleValidationError,
  patientControllers.addFamilyMembersController,
)
patientRoutes.get(
  '/family-members',
  patientControllers.getFamilyMembersController,
)
patientRoutes.patch(
  '/remove-member',
  patientValidators.validateMongooseId,
  patientControllers.removeFamilyMemberController,
)
patientRoutes.get(
  '/profile',

  patientControllers.getPatientProfileController,
)
patientRoutes.get('/doctor-info', patientControllers.getDoctorProfileController)
export default patientRoutes
