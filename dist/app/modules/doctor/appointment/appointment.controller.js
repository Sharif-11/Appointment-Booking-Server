"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentControllers = void 0;
const appointment_service_1 = require("./appointment.service");
const appointment_utils_1 = __importDefault(require("./appointment.utils"));
const createAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slotId } = req.body;
        const appointment = yield appointment_service_1.appointmentServices.createAppointment(slotId);
        res.status(200).send({
            status: true,
            message: 'Appointment created successfully',
            data: appointment,
        });
    }
    catch (error) {
        res.status(500).send({
            status: false,
            message: 'Appointment creation failed',
            errors: [error.message],
        });
    }
});
const startAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield appointment_service_1.appointmentServices.startAppointment(id);
        res.status(200).json({
            status: true,
            message: 'appointment started successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Appointment starting failed',
            errors: [error.message],
        });
    }
});
const closeAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield appointment_service_1.appointmentServices.closeAppointment(id);
        res.status(200).json({
            status: true,
            message: 'appoinment closed successfully',
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'appoinment closing failed',
            errors: [error.message],
        });
    }
});
const deleteAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield appointment_service_1.appointmentServices.deleteAppoinment(id);
        res.status(200).json({
            status: true,
            message: 'appointment deleted successfully',
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'appointment deletion failed',
            errors: [error.message],
        });
    }
});
const getAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield appointment_service_1.appointmentServices.getAppointments();
        res.status(200).json({
            status: true,
            message: 'appointments found successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'appointments retreiving failed',
            errors: [error === null || error === void 0 ? void 0 : error.message],
        });
    }
});
const getUpcomingAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = (0, appointment_utils_1.default)();
        console.log({ date });
        const result = yield appointment_service_1.appointmentServices.getUpcomingAppointment(date);
        res.status(200).json({
            status: true,
            message: 'todays appointments found successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'todays appointments are not found successfully',
            errors: [error.message],
        });
    }
});
const startableAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = (0, appointment_utils_1.default)();
        const result = yield appointment_service_1.appointmentServices.getStartableAppointments(date);
        res.status(200).json({
            status: true,
            message: 'startable appointments found successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'startable appointments retreiving failed',
            errors: [error.message],
        });
    }
});
const deletableAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield appointment_service_1.appointmentServices.getDeletableAppointments();
        res.status(200).json({
            status: true,
            message: 'deletable appointments found successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'deletable appointments founding failed',
            data: [error.message],
        });
    }
});
const existingAppointmentForSlotInDayController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slotId } = req.params;
        const result = yield appointment_service_1.appointmentServices.existingAppointmentForSlotInDay(slotId);
        res.status(200).json({
            status: true,
            message: 'existing appointment retreived successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Appointment retreiving failed',
            data: [error.message],
        });
    }
});
const allAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield appointment_service_1.appointmentServices.allAppointments();
        res.status(200).json({
            status: true,
            message: 'All appointments retreived successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Appointments retreiving failed',
            data: [error.message],
        });
    }
});
const getAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        const data = yield appointment_service_1.appointmentServices.getAppointment(id);
        const response = {
            status: true,
            message: 'Appointment retreived successfully',
            data,
        };
        res.write(`data: ${JSON.stringify(response)}\n\n`);
    }
    catch (error) {
        const response = {
            status: false,
            message: 'Appointment retreiving failed',
            data: [error === null || error === void 0 ? void 0 : error.message],
        };
        res.write(`data: ${JSON.stringify(response)}\n\n`);
    }
});
exports.appointmentControllers = {
    createAppointmentController,
    startAppointmentController,
    closeAppointmentController,
    deleteAppointmentController,
    getAppointmentsController,
    getUpcomingAppointmentsController,
    startableAppointmentController,
    deletableAppointmentController,
    existingAppointmentForSlotInDayController,
    allAppointmentsController,
    getAppointment,
};
