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
exports.patientQueueServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = __importDefault(require("../patient/booking/booking.model"));
const getQueuedPatient = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.default.aggregate([
        { $match: { appointmentId: new mongoose_1.default.Types.ObjectId(appointmentId) } },
        {
            $lookup: {
                from: 'patients',
                localField: 'patientId',
                foreignField: '_id',
                as: 'patient',
            },
        },
        { $unwind: '$patient' },
        {
            $addFields: {
                serviceStatusOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$serviceStatus', 'in service'] }, then: 1 },
                            { case: { $eq: ['$serviceStatus', 'waiting'] }, then: 2 },
                            { case: { $eq: ['$serviceStatus', 'served'] }, then: 3 },
                        ],
                        default: 4, // Default to a higher value for other statuses
                    },
                },
            },
        },
        { $sort: { serviceStatusOrder: 1 } },
        {
            $project: {
                _id: 1,
                name: '$patient.name',
                dateOfBirth: '$patient.dateOfBirth',
                email: '$patient.email',
                appointmentId: 1,
                serviceStatus: 1, // Include serviceStatus field
                // Add other fields if needed
            },
        },
    ]);
    return result;
});
const updateServiceStatus = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the booking to update
    const bookingToUpdate = yield booking_model_1.default.findById(bookingId);
    if (!bookingToUpdate) {
        throw new Error('Booking not found');
    }
    else if (bookingToUpdate.serviceStatus === 'served') {
        throw new Error('This booking is already served');
    }
    else if (bookingToUpdate.serviceStatus === 'in service') {
        const result = yield booking_model_1.default.findByIdAndUpdate(bookingId, {
            $set: { serviceStatus: 'served' },
        }, { new: true });
        return result;
    }
    else {
        const existingBooking = yield booking_model_1.default.findOne({
            appointmentId: bookingToUpdate.appointmentId,
            serviceStatus: 'in service',
        });
        if (existingBooking) {
            throw new Error('There is already a patient in service');
        }
        const result = yield booking_model_1.default.findByIdAndUpdate(bookingId, {
            $set: { serviceStatus: 'in service' },
        }, { new: true });
        return result;
    }
});
exports.patientQueueServices = { getQueuedPatient, updateServiceStatus };
