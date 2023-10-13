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
exports.doctorControllers = void 0
const doctor_service_1 = require('./doctor.service')
const createDoctorController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield doctor_service_1.doctorServices
      .createDoctorService(req.body)
      .then(() => {
        res.status(200).json({
          status: true,
          message: 'doctor created successfully',
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            status: false,
            message: err === null || err === void 0 ? void 0 : err.message,
          })
      })
  })
const updateDoctorController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { phoneNo } = req.decoded
      const data = yield doctor_service_1.doctorServices.updateDoctorService(
        phoneNo,
        req.body,
      )
      res.status(200).json({
        status: true,
        message: 'doctor info updated successfully',
        data,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'doctor info update failed',
        errors: [error.message],
      })
    }
  })
exports.doctorControllers = {
  createDoctorController,
  updateDoctorController,
}
