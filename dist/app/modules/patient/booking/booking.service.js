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
exports.bookingServices = void 0;
const appointment_service_1 = require("../../doctor/appointment/appointment.service");
const booking_model_1 = __importDefault(require("./booking.model"));
const findExistedBooking = (appointmentId, patientId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.default.findOne({ appointmentId, patientId });
    return result;
});
const createBooking = (appointmentId, patientId, problemDescription, session) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_service_1.appointmentServices.getAppointment(appointmentId);
    if (!appointment) {
        throw new Error('Appointment with this id does not exist');
    }
    const existedBooking = yield findExistedBooking(appointmentId, patientId);
    if (existedBooking) {
        throw new Error('You already booked a slot');
    }
    const bookingInfo = {
        paymentStatus: 'unpaid',
        serviceStatus: 'pending',
        appointmentId,
        patientId,
        problemDescription,
    };
    const newBooking = yield booking_model_1.default.create([bookingInfo], { session });
    return newBooking[0];
});
const updateBookingStatus = (id, updateObj, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.default.findByIdAndUpdate(id, {
        $set: updateObj,
    }, { new: true, session });
    return result;
});
const deleteBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.default.findByIdAndDelete(bookingId, { new: true });
    return result;
});
const cancelBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ bookingId });
    const existedBooking = yield booking_model_1.default.findById(bookingId);
    console.log(existedBooking);
    if (!existedBooking) {
        throw new Error('Booking does not exist');
    }
    if (existedBooking.paymentStatus === 'paid') {
        throw new Error('Paid booking can not be canceled');
    }
    const result = yield booking_model_1.default.findByIdAndDelete(bookingId);
    console.log({ result });
    return result;
});
exports.bookingServices = {
    createBooking,
    updateBookingStatus,
    findExistedBooking,
    deleteBooking,
    cancelBooking,
};
