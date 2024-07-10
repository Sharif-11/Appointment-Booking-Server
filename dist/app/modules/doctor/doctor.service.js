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
exports.doctorServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const doctor_model_1 = __importDefault(require("./doctor.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const createDoctorService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const role = 'Doctor';
    const { phoneNo, password } = userData, doctor = __rest(userData, ["phoneNo", "password"]);
    console.log({ doctor });
    const user = { phoneNo, password, role };
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newDoctor = yield doctor_model_1.default.create([doctor], { session });
        if (!newDoctor.length) {
            throw new Error('doctor creation failed');
        }
        user.userId = newDoctor[0]._id;
        const newUser = yield user_model_1.default.create([user], { session });
        if (!newUser.length) {
            throw new Error('user creation failed');
        }
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const updateDoctorService = (phoneNo, updateObj) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ phoneNo });
    console.log(user === null || user === void 0 ? void 0 : user.userId);
    const result = yield doctor_model_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.userId, {
        $set: updateObj,
    }, { new: true });
    return result;
});
exports.doctorServices = { createDoctorService, updateDoctorService };
