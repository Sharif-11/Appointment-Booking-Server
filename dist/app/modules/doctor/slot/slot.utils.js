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
exports.slotUtilityFuntions = exports.convertTo24HourFormat = exports.convertTo12HourFormat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const convertTo12HourFormat = (time24) => {
    // Split the time into hours and minutes
    const [hours, minutes] = time24.split(':').map(Number);
    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';
    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be converted to 12 for 12-hour format
    // Format the time in 12-hour format with two-digit hour and minute
    const time12 = `${hours12.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${period}`;
    return time12;
};
exports.convertTo12HourFormat = convertTo12HourFormat;
const convertTo24HourFormat = (time12) => {
    const [timePart, period] = time12.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
        hours24 += 12;
    }
    else if (period === 'AM' && hours === 12) {
        hours24 = 0;
    }
    const time24 = `${hours24.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    return time24;
};
exports.convertTo24HourFormat = convertTo24HourFormat;
function slotModelValidator(weekDay, startTime, endTime, bookingStartTime, bookingEndTime) {
    return __awaiter(this, void 0, void 0, function* () {
        startTime = (0, exports.convertTo24HourFormat)(startTime);
        endTime = (0, exports.convertTo24HourFormat)(endTime);
        bookingStartTime = (0, exports.convertTo24HourFormat)(bookingStartTime);
        bookingEndTime = (0, exports.convertTo24HourFormat)(bookingEndTime);
        if (endTime <= startTime) {
            return {
                status: false,
                message: 'startTime must be less than endTime',
                data: { startTime, endTime, bookingStartTime, bookingEndTime },
            };
        }
        else if (bookingEndTime <= bookingStartTime) {
            return {
                status: false,
                message: 'bookingStartTime must be less than bookingEndTime',
                data: { startTime, endTime, bookingStartTime, bookingEndTime },
            };
        }
        else if (bookingEndTime > startTime) {
            return {
                status: false,
                message: 'bookingStartTime must be less than or equal to  endTime',
                data: { startTime, endTime, bookingStartTime, bookingEndTime },
            };
        }
        // Additional pre-update validation logic here...
        const overlappingSlot = yield mongoose_1.default.models.Slot.findOne({
            weekDay,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
            ],
        });
        if (overlappingSlot) {
            return {
                status: false,
                message: 'Slot is overlapped with already existed slot',
                data: { startTime, endTime, bookingStartTime, bookingEndTime },
            };
        }
        return {
            status: true,
            data: { startTime, endTime, bookingStartTime, bookingEndTime },
        };
    });
}
exports.slotUtilityFuntions = {
    convertTo12HourFormat: exports.convertTo12HourFormat,
    convertTo24HourFormat: exports.convertTo24HourFormat,
    slotModelValidator,
};
