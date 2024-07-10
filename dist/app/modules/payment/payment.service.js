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
exports.paymentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../../config"));
const appointment_model_1 = __importDefault(require("../doctor/appointment/appointment.model"));
const appointment_service_1 = require("../doctor/appointment/appointment.service");
const booking_service_1 = require("../patient/booking/booking.service");
const payment_model_1 = __importDefault(require("./payment.model"));
const createPayment = (payment, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.default.create([payment], { session });
    return result[0];
});
const initiatePayment = (amount, bookingId, name, email, phoneNo) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ amount, bookingId, name, email, phoneNo });
    const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: 'REF123',
        success_url: 'http://localhost:5000/api/v1/payment/success/' + bookingId,
        fail_url: 'http://localhost:5000/api/v1/payment/fail/' + bookingId,
        cancel_url: 'http://localhost:5000/api/v1/payment/cancel/' + bookingId,
        ipn_url: 'http://localhost:5000/api/v1/payment/ipn/' + bookingId,
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: phoneNo,
        cus_fax: '01711111111',
        ship_name: name,
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new sslcommerz_lts_1.default(config_1.default.ssl_id, config_1.default.ssl_password, false);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const apiResponse = yield sslcz.init(data);
            const GatewayPageURL = apiResponse.GatewayPageURL;
            resolve(GatewayPageURL);
        }
        catch (error) {
            reject(error);
        }
    }));
});
const confirmPayment = (paymentData, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const newPayment = yield payment_model_1.default.create([paymentData], { session });
        if (!newPayment.length) {
            throw new Error('payment creation failed');
        }
        const updateObj = {
            paymentId: newPayment._id,
            paymentStatus: 'paid',
        };
        const updateBooking = yield booking_service_1.bookingServices.updateBookingStatus(bookingId, updateObj, session);
        if (!updateBooking) {
            throw new Error('update booking failed');
        }
        const appointment = yield appointment_model_1.default.findById(updateBooking.appointmentId);
        const updatedAppointment = yield appointment_service_1.appointmentServices.updateAppointmentSlotCount(appointment === null || appointment === void 0 ? void 0 : appointment._id, session);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
exports.paymentServices = {
    createPayment,
    initiatePayment,
    confirmPayment,
};
