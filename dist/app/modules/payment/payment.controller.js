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
exports.paymentControllers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const appointment_service_1 = require("../doctor/appointment/appointment.service");
const booking_model_1 = __importDefault(require("../patient/booking/booking.model"));
const booking_service_1 = require("../patient/booking/booking.service");
const payment_service_1 = require("./payment.service");
const redisClient = (0, redis_1.createClient)();
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () { return yield redisClient.connect(); });
connectRedis();
const confirmPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const { id: bookingId } = req.params;
        const { tran_id: transactionId, amount, tran_date: date } = req.body;
        const payment = yield payment_service_1.paymentServices.createPayment({
            transactionId,
            date,
            amount,
        }, session);
        if (!payment) {
            throw new Error('payment creation failed');
        }
        const updatedSlot = yield booking_service_1.bookingServices.updateBookingStatus(bookingId, {
            paymentStatus: 'paid',
            paymentId: payment._id,
        });
        if (!updatedSlot) {
            throw new Error('booking update failed');
        }
        const booking = yield booking_model_1.default.findById(bookingId);
        const updatedAppointment = yield appointment_service_1.appointmentServices.updateAppointmentSlotCount(String(booking === null || booking === void 0 ? void 0 : booking.appointmentId), session);
        if (!updatedAppointment) {
            throw new Error('appointment update failed');
        }
        yield session.commitTransaction();
        yield session.endSession();
        redisClient
            .publish(`appointment:${updatedAppointment._id}`, JSON.stringify(updatedAppointment))
            .then(() => console.log(`Message published on: appointment:${updatedAppointment._id}`))
            .catch(err => console.log(err === null || err === void 0 ? void 0 : err.message));
        const html = `<h1 style="color: green;text-align:center">Payment Successful</h1>`;
        res.set('Content-Type', 'text/html');
        res.send(html);
    }
    catch (error) {
        res.status(500).send({
            status: false,
            message: 'payment confirmation failed',
            errors: [error.message],
        });
    }
});
const errorPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: bookingId } = req.params;
        console.log({ errorId: bookingId });
        yield booking_service_1.bookingServices.deleteBooking(bookingId);
        const html = `<h1 style="color: red;text-align:center">Payment Failed</h1>`;
        res.set('Content-Type', 'text/html');
        res.send(html);
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'payment failed',
            errors: [error.message],
        });
    }
});
exports.paymentControllers = {
    confirmPaymentController,
    errorPaymentController,
};
