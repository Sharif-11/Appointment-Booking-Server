import express from 'express'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import { patientQueueControllers } from '../patient-queue/patientQueue.controller'
import { appointmentControllers } from './appointment/appointment.controller'
import appointmentValidate from './appointment/appointment.validator'
import { doctorControllers } from './doctor.controller'
import { doctorValidators } from './doctor.validator'
import { slotControllers } from './slot/slot.controller'
import { slotValidators } from './slot/slot.validator'
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
doctorRoutes.get('/slots', slotControllers.getSlotsForAppointmentController)
doctorRoutes.get(
  '/appointments',
  appointmentControllers.allAppointmentsController,
)
doctorRoutes.delete('/slot/:id', slotControllers.deleteSlotController)
doctorRoutes.post(
  '/appointment',
  appointmentValidate,
  appointmentControllers.createAppointmentController,
)
doctorRoutes.get(
  '/appointment/startable-appointments',
  appointmentControllers.startableAppointmentController,
)
doctorRoutes.get(
  '/appointment/deletable-appointments',
  appointmentControllers.deletableAppointmentController,
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
// doctorRoutes.patch(
//   '/booking/:id',
//   bookingValidators.validateServiceStatus,
//   bookingControllers.updateBookingStatusController,
// )
doctorRoutes.put(
  '/profile',
  doctorValidators.updateDoctorValidation,
  doctorControllers.updateDoctorController,
)
doctorRoutes.get(
  '/appointment/:slotId',
  appointmentControllers.existingAppointmentForSlotInDayController,
)
//doctorRoutes.put('/slot/:id', slotControllers.updateSlotController)
export default doctorRoutes
