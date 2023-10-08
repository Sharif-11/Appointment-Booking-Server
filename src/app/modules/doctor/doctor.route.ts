import express from 'express'
import { slotValidators } from './slot/slot.validator'
import { slotControllers } from './slot/slot.controller'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import appointmentValidate from './appointment/appointment.validator'
import { appointmentControllers } from './appointment/appointment.controller'
import { patientQueueControllers } from '../patient-queue/patientQueue.controller'
import { bookingValidators } from '../patient/booking/booking.validator'
import { bookingControllers } from '../patient/booking/booking.controller'
import { doctorControllers } from './doctor.controller'
import { doctorValidators } from './doctor.validator'
const doctorRoutes = express.Router()
doctorRoutes.use(
  authMiddlewares.verifyTokenMiddleware,
  authMiddlewares.verifyUser('Doctor'),
)
doctorRoutes.post(
  '/slot',
  slotValidators.validateSlot,
  slotControllers.createSlotController,
)
doctorRoutes.post('/slots', slotControllers.getSlotsOfDayController)
doctorRoutes.delete('/slot/:id', slotControllers.deleteSlotController)
doctorRoutes.post(
  '/appointment',
  appointmentValidate,
  appointmentControllers.createAppointmentController,
)
doctorRoutes.patch(
  '/appointment/start-appointment/:id',
  appointmentControllers.startAppointmentController,
)
doctorRoutes.patch(
  '/appointment/close-appointment/:id',
  appointmentControllers.closeAppointmentController,
)
doctorRoutes.delete(
  '/appointment/:id',
  appointmentControllers.deleteAppointmentController,
)
doctorRoutes.get(
  '/appointments',
  appointmentControllers.getAppointmentsController,
)
doctorRoutes.get(
  '/patient-queue/:id',
  patientQueueControllers.getQueuedPatientController,
)
doctorRoutes.patch(
  '/booking/:id',
  bookingValidators.validateServiceStatus,
  bookingControllers.updateBookingStatusController,
)
doctorRoutes.put(
  '/profile',
  doctorValidators.updateDoctorValidation,
  doctorControllers.updateDoctorController,
)
//doctorRoutes.put('/slot/:id', slotControllers.updateSlotController)
export default doctorRoutes
