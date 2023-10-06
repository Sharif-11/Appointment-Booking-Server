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
exports.patientServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const patient_model_1 = __importDefault(require("./patient.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const createPatientService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const role = 'Patient';
    const { name, email, phoneNo, password, dateOfBirth } = userData;
    const user = { phoneNo, password, role };
    const patient = { name, email, dateOfBirth };
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newPatient = yield patient_model_1.default.create([patient], { session });
        if (!newPatient.length) {
            throw new Error('patient creation failed');
        }
        user.userId = newPatient[0]._id;
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
const updatePatientProfile = (phoneNo, updateObj) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ phoneNo });
    const updatedPatient = yield patient_model_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.userId, {
        $set: updateObj,
    }, { new: true });
    return updatedPatient;
});
const getPatientProfile = (phoneNo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ phoneNo });
    const result = yield patient_model_1.default.findById(user === null || user === void 0 ? void 0 : user.userId);
    return result;
});
const getDoctorProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = doctor_model_1.default.findOne({}).select('-_id');
    return doctor;
});
exports.patientServices = {
    createPatientService,
    updatePatientProfile,
    getPatientProfile,
    getDoctorProfile,
};
