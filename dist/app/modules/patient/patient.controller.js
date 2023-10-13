'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.patientControllers = void 0
const patient_service_1 = require('./patient.service')
const createPatientController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield patient_service_1.patientServices
      .createPatientService(req.body)
      .then(() => {
        res.status(200).json({
          status: true,
          message: 'patient created successfully',
        })
      })
      .catch(err =>
        res.status(500).json({
          status: false,
          message: 'patient creation failed!!',
          errors: err,
        }),
      )
  })
const updatedPatientController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { phoneNo } = req.decoded
      const data = yield patient_service_1.patientServices.updatePatientProfile(
        phoneNo,
        req.body,
      )
      res.status(200).json({
        status: true,
        message: 'patient update successfully',
        data,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'patient update failed',
        errors: [error.message],
      })
    }
  })
const getPatientProfileController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { phoneNo } = req.decoded
      const data = yield patient_service_1.patientServices.getPatientProfile(
        phoneNo,
      )
      res.status(200).json({
        status: true,
        message: 'patient profile retreiving successull',
        data,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'patient profile finding failed',
        errors: [error.message],
      })
    }
  })
const getDoctorProfileController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const data = yield patient_service_1.patientServices.getDoctorProfile()
      res.status(200).json({
        status: true,
        message: 'doctor profile retreived successfully',
        data,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'doctor profile retreiving failed',
        errors: [error.message],
      })
    }
  })
exports.patientControllers = {
  createPatientController,
  updatedPatientController,
  getPatientProfileController,
  getDoctorProfileController,
}
