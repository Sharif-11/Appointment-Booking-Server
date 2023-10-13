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
exports.slotControllers = void 0
const slot_service_1 = require('./slot.service')
const createSlotController = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const slot = yield slot_service_1.slotServices.createSlot(req.body)
      res.status(200).json({
        status: true,
        message: 'slot created successfully',
        data: slot,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'slot creation failed',
        errors: [error === null || error === void 0 ? void 0 : error.message],
      })
    }
  })
const getSlotsController = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const allSlots = yield slot_service_1.slotServices.getAllSlot()
      res.status(200).json({
        status: true,
        message: 'retreiving slots successfull',
        data: allSlots,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'retreiving slots failed',
        errors: [error === null || error === void 0 ? void 0 : error.message],
      })
    }
  })
const deleteSlotController = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { id } = req.params
      const deletedSlot = yield slot_service_1.slotServices.deleteSlot(id)
      res.status(200).json({
        status: true,
        message: 'slot deletion successfull',
        data: deletedSlot,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'slot deletion failed',
        data: [error.message],
      })
    }
  })
const getSlotsOfDayController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { weekDay } = req.body
      const data = yield slot_service_1.slotServices.getSlots(weekDay)
      res.status(200).json({
        status: true,
        message: 'slots retreived successfully',
        data,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'slots retreiving failed',
        errors: [error.message],
      })
    }
  })
exports.slotControllers = {
  createSlotController,
  getSlotsController,
  deleteSlotController,
  getSlotsOfDayController,
}
