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
exports.slotServices = void 0;
const time_utils_1 = require("../../../utils/time.utils");
const slot_model_1 = __importDefault(require("./slot.model"));
const createSlot = (slot) => __awaiter(void 0, void 0, void 0, function* () {
    const newSlot = yield slot_model_1.default.create(slot);
    return newSlot;
});
const getAllSlot = () => __awaiter(void 0, void 0, void 0, function* () {
    const allSlots = yield slot_model_1.default.find();
    return allSlots;
});
const deleteSlot = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedSlot = yield slot_model_1.default.findByIdAndDelete(id);
    return deletedSlot;
});
const getSlots = (weekDay) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.default.find({ weekDay });
    return result;
});
const getSlotsForAppointment = (weekDay) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.default.find({ weekDay: (0, time_utils_1.getToday)() || weekDay }).lean();
    return result;
});
exports.slotServices = {
    createSlot,
    getAllSlot,
    deleteSlot,
    getSlots,
    getSlotsForAppointment,
};
