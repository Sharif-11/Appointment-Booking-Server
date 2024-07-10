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
exports.bookingControllers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slot_model_1 = __importDefault(require("../../doctor/slot/slot.model"));
const payment_service_1 = require("../../payment/payment.service");
const booking_service_1 = require("./booking.service");
const createBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const { name, userId: patientId, phoneNo, email } = req.body.user;
        const { problemDescription, slotId } = req.body;
        const { id: appointmentId } = req.params;
        const booking = yield booking_service_1.bookingServices.createBooking(appointmentId, patientId, problemDescription, session);
        console.log({ slotId });
        if (!booking) {
            throw new Error('Booking creation failed');
        }
        const slot = yield slot_model_1.default.findById(slotId);
        if (!slot) {
            throw new Error('Slot with this id does not exist');
        }
        payment_service_1.paymentServices
            .initiatePayment(slot.visitingFee, booking._id.toString(), name, email, phoneNo)
            .then((GatewayPageURL) => __awaiter(void 0, void 0, void 0, function* () {
            yield session.commitTransaction();
            yield session.endSession();
            res.status(200).json({
                status: true,
                message: 'Booking created successfully',
                data: { url: GatewayPageURL },
            });
        }))
            .catch(() => {
            throw new Error('payment initiation failed');
        });
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        res.status(500).json({
            status: false,
            message: 'Booking creation failed',
            errors: [error.message],
        });
    }
});
const checkBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: appointmentId } = req.params;
        const { userId: patientId } = req.body;
        const existedBooking = yield booking_service_1.bookingServices.findExistedBooking(appointmentId, patientId);
        console.log(existedBooking);
        res.status(200).json({
            status: true,
            message: 'existed booking checked successfully',
            data: existedBooking ? existedBooking : false,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'existed booking checking failed',
            errors: [error.message],
        });
    }
});
const cancelBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.params;
        const result = yield booking_service_1.bookingServices.cancelBooking(bookingId);
        res.status(200).json({
            status: true,
            message: 'Booking cancelled successfully',
            data: result ? false : result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Booking cancellation failed',
            errors: [error.message],
        });
    }
});
exports.bookingControllers = {
    createBookingController,
    checkBookingController,
    cancelBookingController,
};
