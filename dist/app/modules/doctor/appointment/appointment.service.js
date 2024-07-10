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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const time_utils_1 = require("../../../utils/time.utils");
const booking_model_1 = __importDefault(require("../../patient/booking/booking.model"));
const doctor_constant_1 = require("../doctor.constant");
const slot_model_1 = __importDefault(require("../slot/slot.model"));
const slot_utils_1 = require("../slot/slot.utils");
const appointment_model_1 = __importDefault(require("./appointment.model"));
const appointment_utils_1 = __importDefault(require("./appointment.utils"));
const getAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default.findById(id);
    return result;
});
const createAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield slot_model_1.default.findById(id);
    if (!slot) {
        throw new Error("slot with this id don't exists");
    }
    const { capacity } = slot;
    if ((0, time_utils_1.getToday)() !== slot.weekDay) {
        throw new Error(`You can't create a appointment for this slot now`);
    }
    const appointmentData = {
        slotId: slot._id,
        date: (0, appointment_utils_1.default)(),
        remainingSlots: capacity,
        status: 'pending',
    };
    const newAppointment = yield appointment_model_1.default.create(appointmentData);
    return newAppointment;
});
const startAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.default.findById(id);
    if (!appointment) {
        throw new Error("Appointment with this id don't exists");
    }
    const currentDate = new Date();
    const today = doctor_constant_1.daysOfWeek[currentDate.getDay()];
    const weekDay = doctor_constant_1.daysOfWeek[new Date(appointment.date).getDay()];
    if (today !== weekDay) {
        throw new Error(`You can't start this appointment now`);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const updatedAppointment = yield appointment_model_1.default.findByIdAndUpdate(appointment._id, {
            $set: {
                status: 'running',
            },
        }, { new: true }).session(session);
        if (!updatedAppointment) {
            throw new Error('starting appointment failed');
        }
        yield booking_model_1.default.updateMany({}, {
            $set: {
                serviceStatus: 'waiting',
            },
        }).session(session);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const closeAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.default.findById(id);
    if (!appointment) {
        throw new Error(`Appointment with this id doesn't exist`);
    }
    if (appointment.status === 'pending') {
        throw new Error(`This appointment doesn't started yet`);
    }
    if (appointment.status === 'closed') {
        throw new Error('This appoinment closed already');
    }
    const unservedPatient = yield booking_model_1.default.findOne({
        appointmentId: appointment._id,
        serviceStatus: {
            $in: ['waiting', 'in service'],
        },
    });
    if (unservedPatient) {
        throw new Error('There are some patient yet to be served');
    }
    const closedAppointment = yield appointment_model_1.default.findByIdAndUpdate(id, {
        $set: {
            status: 'closed',
        },
    }, { new: true });
    return closedAppointment;
});
const deleteAppoinment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appoinment = yield appointment_model_1.default.findById(id);
    if (!appoinment) {
        throw new Error(`Appointment with this id doesn't exist`);
    }
    if (appoinment.status === 'running') {
        throw new Error(`Running appointment can't be deleted`);
    }
    else if (appoinment.status === 'closed') {
        const session = yield mongoose_1.default.startSession();
        try {
            const deleteAllBookings = yield booking_model_1.default.deleteMany({
                appointmentId: appoinment._id,
            }).session(session);
            if (!deleteAllBookings) {
                throw new Error('Appointment deletion failed');
            }
            yield appointment_model_1.default.findByIdAndDelete(id).session(session);
            yield session.commitTransaction();
            yield session.endSession();
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw error;
        }
    }
    else {
        const pendingPatient = yield booking_model_1.default.findOne({ appointmentId: id });
        if (pendingPatient) {
            throw new Error(`Appoinment which has any booked patient can't be deleted`);
        }
        const result = yield appointment_model_1.default.findByIdAndDelete(id);
        return result;
    }
});
const getAppointments = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointment_model_1.default.find({}).sort({
        createdAt: -1,
    });
    return appointments;
});
const getUpcomingAppointment = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default.aggregate([
        {
            $match: {
                status: 'pending',
                date,
            },
        },
        {
            $lookup: {
                from: 'slots',
                localField: 'slotId',
                foreignField: '_id',
                as: 'data',
            },
        },
        {
            $unwind: '$data',
        },
        {
            $project: {
                _id: 1,
                remainingSlots: 1,
                status: 1,
                createdAt: 1,
                visitingFee: '$data.visitingFee',
                startTime: '$data.startTime',
                endTime: '$data.endTime',
                bookingStartTime: '$data.bookingStartTime',
                bookingEndTime: '$data.bookingEndTime',
                slotId: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);
    return result;
});
const getStartableAppointments = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default.aggregate([
        {
            $match: {
                date,
                status: 'pending',
            },
        },
        {
            $lookup: {
                from: 'slots',
                localField: 'slotId',
                foreignField: '_id',
                as: 'matchedData',
            },
        },
        {
            $unwind: '$matchedData',
        },
        {
            $project: {
                _id: 1,
                startTime: '$matchedData.startTime',
                endTime: '$matchedData.endTime',
                bookingStartTime: '$matchedData.bookingStartTime',
                bookingEndTime: '$matchedData.bookingEndTime',
            },
        },
    ]);
    return result;
});
const getDeletableAppointments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default.aggregate([
        {
            $match: {
                status: {
                    $in: ['pending', 'closed'],
                },
            },
        },
        {
            $lookup: {
                from: 'bookings',
                localField: '_id',
                foreignField: 'appointmentId',
                as: 'data',
            },
        },
        {
            $match: {
                $or: [
                    {
                        status: 'pending',
                        data: [],
                    },
                    {
                        status: 'closed',
                    },
                ],
            },
        },
        {
            $project: { data: 0 },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);
    return result;
});
const updateAppointmentSlotCount = (appointmentId, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default.findByIdAndUpdate(appointmentId, {
        $inc: {
            remainingSlots: -1,
        },
    }, {
        new: true,
        session,
    });
    return result;
});
const existingAppointmentForSlotInDay = (slotId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ slotId, date: (0, appointment_utils_1.default)() });
    const result = yield appointment_model_1.default.findOne({ slotId, date: (0, appointment_utils_1.default)() });
    return result;
});
const allAppointments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default.aggregate([
        { $match: { date: (0, appointment_utils_1.default)() } },
        {
            $lookup: {
                from: 'slots',
                localField: 'slotId',
                foreignField: '_id',
                as: 'slotInfo',
            },
        },
        {
            $lookup: {
                from: 'bookings',
                localField: '_id',
                foreignField: 'appointmentId',
                as: 'bookings',
            },
        },
        {
            $addFields: {
                appointmentAction: {
                    $switch: {
                        branches: [
                            {
                                case: { $eq: ['$status', 'closed'] },
                                then: 'delete',
                            },
                            {
                                case: { $eq: ['$status', 'pending'] },
                                then: {
                                    $cond: {
                                        if: { $eq: [{ $size: { $ifNull: ['$bookings', []] } }, 0] },
                                        then: 'delete',
                                        else: {
                                            $cond: {
                                                if: { $in: ['paid', '$bookings.paymentStatus'] },
                                                then: 'start',
                                                else: null,
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                case: { $eq: ['$status', 'running'] },
                                then: {
                                    $cond: {
                                        if: {
                                            $eq: [
                                                {
                                                    $size: {
                                                        $filter: {
                                                            input: '$bookings',
                                                            as: 'b',
                                                            cond: { $ne: ['served', '$$b.serviceStatus'] },
                                                        },
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                        then: 'close',
                                        else: null,
                                    },
                                },
                            },
                        ],
                        default: null,
                    },
                },
            },
        },
        { $unwind: '$slotInfo' },
        {
            $project: {
                _id: 1,
                date: 1,
                remainingSlots: 1,
                status: 1,
                slotId: '$slotInfo._id',
                appointmentAction: 1,
                startTime: '$slotInfo.startTime',
                endTime: '$slotInfo.endTime',
                bookingStartTime: '$slotInfo.bookingStartTime',
                bookingEndTime: '$slotInfo.bookingEndTime',
            },
        },
    ]);
    return result.map((_a) => {
        var { startTime, endTime, bookingStartTime, bookingEndTime } = _a, others = __rest(_a, ["startTime", "endTime", "bookingStartTime", "bookingEndTime"]);
        return Object.assign(Object.assign({}, others), { startTime: (0, slot_utils_1.convertTo12HourFormat)(startTime), endTime: (0, slot_utils_1.convertTo12HourFormat)(endTime), bookingStartTime: (0, slot_utils_1.convertTo12HourFormat)(bookingStartTime), bookingEndTime: (0, slot_utils_1.convertTo12HourFormat)(bookingEndTime) });
    });
});
exports.appointmentServices = {
    createAppointment,
    startAppointment,
    closeAppointment,
    deleteAppoinment,
    getAppointments,
    getUpcomingAppointment,
    getStartableAppointments,
    getDeletableAppointments,
    getAppointment,
    updateAppointmentSlotCount,
    existingAppointmentForSlotInDay,
    allAppointments,
};
