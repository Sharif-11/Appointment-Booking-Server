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
const mongoose_1 = require("mongoose");
const appointment_utils_1 = __importDefault(require("./appointment.utils"));
const appointmentSchema = new mongoose_1.Schema({
    slotId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Slot',
    },
    date: {
        type: String,
        required: true,
    },
    remainingSlots: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'closed'],
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
appointmentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const appoinment = this;
        const existedAppointment = yield Appointment.findOne({
            slotId: appoinment.slotId,
            date: (0, appointment_utils_1.default)(new Date()),
        });
        if (existedAppointment) {
            next(new Error('Appointment for this date with this slotId already exist'));
        }
        else {
            next();
        }
    });
});
const Appointment = (0, mongoose_1.model)('appointment', appointmentSchema);
exports.default = Appointment;
