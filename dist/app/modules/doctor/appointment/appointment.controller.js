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
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentControllers = void 0;
const appointment_service_1 = require("./appointment.service");
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
        const { date } = req.body;
        const result = yield appointment_service_1.appointmentServices.getUpcomingAppointment(date);
        res.status(200).json({
            status: 200,
            message: 'todays appointments found successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 200,
            message: 'todays appointments are not found successfully',
            errors: [error.message],
        });
    }
});
exports.appointmentControllers = {
    createAppointmentController,
    startAppointmentController,
    closeAppointmentController,
    deleteAppointmentController,
    getAppointmentsController,
    getUpcomingAppointmentsController,
};
