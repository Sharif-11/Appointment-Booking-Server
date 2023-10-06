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
exports.patientQueueControllers = void 0;
const patientQueue_service_1 = require("./patientQueue.service");
const getQueuedPatientController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield patientQueue_service_1.patientQueueServices.getQueuedPatient(id);
        res.status(200).json({
            status: true,
            message: 'patient queue retreived successfully',
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: 'patient queue retreiving failed',
            errors: [error.message],
        });
    }
});
exports.patientQueueControllers = { getQueuedPatientController };
