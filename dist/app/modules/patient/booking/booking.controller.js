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
exports.bookingControllers = void 0;
const booking_service_1 = require("./booking.service");
const response_utils_1 = require("../../response/response.utils");
const createBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { problemDescription, patientId } = req.body;
        const { id } = req.params;
        const { data, appointment } = yield booking_service_1.bookingServices.createBooking(id, patientId, problemDescription);
        res.status(200).json({
            status: true,
            message: 'Appointment booked successfully',
            data: { booking: data, appointment },
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'Appointment booking failed',
            errors: [error.message],
        });
    }
});
const checkBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { phoneNo } = req.decoded;
        // console.log({ appointmentId, phoneNo })
        const data = yield booking_service_1.bookingServices.checkBooking(id, phoneNo);
        res
            .status(200)
            .json(response_utils_1.responseUtility.successResponse('slot confirmation success', data === null ? false : true));
    }
    catch (error) {
        res
            .status(500)
            .json(response_utils_1.responseUtility.errorResponse(`slot confirmation failed`, [
            error === null || error === void 0 ? void 0 : error.message,
        ]), [error === null || error === void 0 ? void 0 : error.message]);
    }
});
const updateBookingStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { serviceStatus } = req.body;
        const data = yield booking_service_1.bookingServices.updateBookingStatus(id, serviceStatus);
        res.status(200).json({
            status: true,
            message: 'service status updated successfully',
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: 'service status update failed',
            errors: [error.message],
        });
    }
});
exports.bookingControllers = {
    createBookingController,
    checkBookingController,
    updateBookingStatusController,
};
