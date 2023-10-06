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
const booking_model_1 = __importDefault(require("../patient/booking/booking.model"));
const getQueuedPatient = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Booking.find({ appointmentId })
    const result = yield booking_model_1.default.find({ appointmentId }).populate({
        path: 'patientId',
        model: 'Patient',
        select: 'name dateOfBirth gender',
        options: { lean: true },
        as: 'patient',
    });
    return result;
});
exports.patientQueueServices = { getQueuedPatient };
