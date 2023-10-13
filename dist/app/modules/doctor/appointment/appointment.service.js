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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.appointmentServices = void 0
const mongoose_1 = __importDefault(require('mongoose'))
const doctor_constant_1 = require('../doctor.constant')
const slot_model_1 = __importDefault(require('../slot/slot.model'))
const appointment_model_1 = __importDefault(require('./appointment.model'))
const appointment_utils_1 = __importDefault(require('./appointment.utils'))
const booking_model_1 = __importDefault(
  require('../../patient/booking/booking.model'),
)
const createAppointment = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield slot_model_1.default.findById(id)
    if (!slot) {
      throw new Error("slot with this id don't exists")
    }
    const { capacity } = slot
    const currentDate = new Date()
    const today = doctor_constant_1.daysOfWeek[currentDate.getDay()]
    if (today !== slot.weekDay) {
      throw new Error(`You can't create a appointment for this slot now`)
    }
    const appointmentData = {
      slotId: slot._id,
      date: (0, appointment_utils_1.default)(currentDate),
      remainingSlots: capacity,
      status: 'pending',
    }
    const newAppointment = yield appointment_model_1.default.create(
      appointmentData,
    )
    return newAppointment
  })
const startAppointment = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.default.findById(id)
    if (!appointment) {
      throw new Error("Appointment with this id don't exists")
    }
    const currentDate = new Date()
    const today = doctor_constant_1.daysOfWeek[currentDate.getDay()]
    const weekDay =
      doctor_constant_1.daysOfWeek[new Date(appointment.date).getDay()]
    if (today !== weekDay) {
      throw new Error(`You can't start this appointment now`)
    }
    const session = yield mongoose_1.default.startSession()
    try {
      yield session.startTransaction()
      const updatedAppointment = yield appointment_model_1.default
        .findByIdAndUpdate(
          appointment._id,
          {
            $set: {
              status: 'running',
            },
          },
          { new: true },
        )
        .session(session)
      if (!updatedAppointment) {
        throw new Error('starting appointment failed')
      }
      yield booking_model_1.default
        .updateMany(
          {},
          {
            $set: {
              serviceStatus: 'waiting',
            },
          },
        )
        .session(session)
      yield session.commitTransaction()
      yield session.endSession()
    } catch (error) {
      yield session.abortTransaction()
      yield session.endSession()
      throw error
    }
  })
const closeAppointment = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.default.findById(id)
    if (!appointment) {
      throw new Error(`Appointment with this id doesn't exist`)
    }
    if (appointment.status === 'pending') {
      throw new Error(`This appointment doesn't started yet`)
    }
    if (appointment.status === 'closed') {
      throw new Error('This appoinment closed already')
    }
    const unservedPatient = yield booking_model_1.default.findOne({
      appointmentId: appointment._id,
      serviceStatus: {
        $in: ['waiting', 'in service'],
      },
    })
    if (unservedPatient) {
      throw new Error('There are some patient yet to be served')
    }
    const closedAppointment =
      yield appointment_model_1.default.findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'closed',
          },
        },
        { new: true },
      )
    return closedAppointment
  })
const deleteAppoinment = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const appoinment = yield appointment_model_1.default.findById(id)
    if (!appoinment) {
      throw new Error(`Appointment with this id doesn't exist`)
    }
    if (appoinment.status === 'running') {
      throw new Error(`Running appointment can't be deleted`)
    } else if (appoinment.status === 'closed') {
      const result = yield appointment_model_1.default.findByIdAndDelete(id)
      return result
    } else {
      const pendingPatient = yield booking_model_1.default.findOne({
        serviceStatus: 'pending',
      })
      if (pendingPatient) {
        throw new Error(
          `Appoinment which has any booked patient can't be deleted`,
        )
      }
      const result = yield appointment_model_1.default.findByIdAndDelete(id)
      return result
    }
  })
const getAppointments = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointment_model_1.default.find({}).sort({
      createdAt: -1,
    })
    return appointments
  })
const getUpcomingAppointment = date =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_model_1.default
      .find({
        date: (0, appointment_utils_1.default)(new Date(date)),
      })
      .sort({ createdAt: -1 })
    return result
  })
exports.appointmentServices = {
  createAppointment,
  startAppointment,
  closeAppointment,
  deleteAppoinment,
  getAppointments,
  getUpcomingAppointment,
}
