"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_validator_1 = require("./user.validator");
const doctor_controller_1 = require("../doctor/doctor.controller");
const patient_controller_1 = require("../patient/patient.controller");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const userRoutes = express_1.default.Router();
userRoutes.post('/doctor', user_validator_1.userValidator.validateDoctor, doctor_controller_1.doctorControllers.createDoctorController);
userRoutes.post('/patient', user_validator_1.userValidator.validatePatient, patient_controller_1.patientControllers.createPatientController);
userRoutes.post('/login', user_validator_1.userValidator.validateLogin, user_controller_1.userControllers.loginController);
userRoutes.get('/login', user_controller_1.userControllers.checkLoginController);
userRoutes.patch('/password', auth_middleware_1.authMiddlewares.verifyTokenMiddleware, user_controller_1.userControllers.updatePasswordController);
exports.default = userRoutes;
