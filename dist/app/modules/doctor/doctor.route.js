"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const patientQueue_controller_1 = require("../patient-queue/patientQueue.controller");
const appointment_controller_1 = require("./appointment/appointment.controller");
const appointment_validator_1 = __importDefault(require("./appointment/appointment.validator"));
const doctor_controller_1 = require("./doctor.controller");
const doctor_validator_1 = require("./doctor.validator");
const slot_controller_1 = require("./slot/slot.controller");
const slot_validator_1 = require("./slot/slot.validator");
const doctorRoutes = express_1.default.Router();
doctorRoutes.use(auth_middleware_1.authMiddlewares.verifyTokenMiddleware, auth_middleware_1.authMiddlewares.verifyUser('Doctor'));
doctorRoutes.post('/slot', slot_validator_1.slotValidators.validateSlot, slot_controller_1.slotControllers.createSlotController);
doctorRoutes.post('/slots', slot_controller_1.slotControllers.getSlotsOfDayController);
doctorRoutes.get('/slots', slot_controller_1.slotControllers.getSlotsForAppointmentController);
doctorRoutes.get('/appointments', appointment_controller_1.appointmentControllers.allAppointmentsController);
doctorRoutes.delete('/slot/:id', slot_controller_1.slotControllers.deleteSlotController);
doctorRoutes.post('/appointment', appointment_validator_1.default, appointment_controller_1.appointmentControllers.createAppointmentController);
doctorRoutes.get('/appointment/startable-appointments', appointment_controller_1.appointmentControllers.startableAppointmentController);
doctorRoutes.get('/appointment/deletable-appointments', appointment_controller_1.appointmentControllers.deletableAppointmentController);
doctorRoutes.patch('/appointment/start-appointment/:id', appointment_controller_1.appointmentControllers.startAppointmentController);
doctorRoutes.patch('/appointment/close-appointment/:id', appointment_controller_1.appointmentControllers.closeAppointmentController);
doctorRoutes.delete('/appointment/delete-appointment/:id', appointment_controller_1.appointmentControllers.deleteAppointmentController);
doctorRoutes.get('/appointments', appointment_controller_1.appointmentControllers.getAppointmentsController);
doctorRoutes.get('/patient-queue/:id', patientQueue_controller_1.patientQueueControllers.getQueuedPatientController);
doctorRoutes.patch('/patient-queue/:bookingId', patientQueue_controller_1.patientQueueControllers.updateServiceStatusController);
// doctorRoutes.patch(
//   '/booking/:id',
//   bookingValidators.validateServiceStatus,
//   bookingControllers.updateBookingStatusController,
// )
doctorRoutes.put('/profile', doctor_validator_1.doctorValidators.updateDoctorValidation, doctor_controller_1.doctorControllers.updateDoctorController);
doctorRoutes.get('/appointment/:slotId', appointment_controller_1.appointmentControllers.existingAppointmentForSlotInDayController);
//doctorRoutes.put('/slot/:id', slotControllers.updateSlotController)
exports.default = doctorRoutes;
