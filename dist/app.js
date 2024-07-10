"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
console.clear();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErroHandler_1 = __importDefault(require("./app/errors/globalErroHandler"));
const appointment_controller_1 = require("./app/modules/doctor/appointment/appointment.controller");
const doctor_route_1 = __importDefault(require("./app/modules/doctor/doctor.route"));
const slot_controller_1 = require("./app/modules/doctor/slot/slot.controller");
const patient_controller_1 = require("./app/modules/patient/patient.controller");
const patient_route_1 = __importDefault(require("./app/modules/patient/patient.route"));
const payment_route_1 = __importDefault(require("./app/modules/payment/payment.route"));
const user_route_1 = __importDefault(require("./app/modules/user/user.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true, // Allow credentials
};
// Use CORS middleware
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/doctor', doctor_route_1.default);
app.use('/api/v1/patient', patient_route_1.default);
app.get('/api/v1/doctor-info', patient_controller_1.patientControllers.getDoctorProfileController);
app.get('/api/v1/appointments', appointment_controller_1.appointmentControllers.getUpcomingAppointmentsController);
app.get('/api/v1/appointment/:id', appointment_controller_1.appointmentControllers.getAppointment);
app.get('/api/v1/slots/:weekDay', slot_controller_1.slotControllers.getSlotsOfDayController);
app.use('/api/v1/payment', payment_route_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to appointment booking system!!!');
});
app.use(globalErroHandler_1.default);
exports.default = app;
