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
exports.bookingServices = void 0
const mongoose_1 = __importDefault(require('mongoose'))
const appointment_model_1 = __importDefault(
  require('../../doctor/appointment/appointment.model'),
)
const doctor_constant_1 = require('../../doctor/doctor.constant')
const user_model_1 = __importDefault(require('../../user/user.model'))
const booking_model_1 = __importDefault(require('./booking.model'))
const patient_model_1 = __importDefault(require('../patient.model'))
const createBooking = (appointmentId, patientId, problemDescription) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date()
    const today = doctor_constant_1.daysOfWeek[currentDate.getDay()]
    const appointment = yield appointment_model_1.default.findById(
      appointmentId,
    )
    if (!appointment) {
      throw new Error("Appointment with this id doesn't exist")
    }
    const patient = yield patient_model_1.default.findById(patientId)
    if (!patient) {
      throw new Error('Patient with this id does not exist')
    }
    const appointmentDay =
      doctor_constant_1.daysOfWeek[new Date(appointment.date).getDay()]
    if (
      today !== appointmentDay ||
      appointment.status !== 'pending' ||
      appointment.remainingSlots <= 0
    ) {
      throw new Error(`You can't book a slot for this appointment`)
    }
    const existedBooking = yield booking_model_1.default.findOne({
      patientId,
      appointmentId,
    })
    if (existedBooking) {
      throw new Error('You already booked a slot')
    }
    const bookingInfo = {
      patientId,
      appointmentId: appointment._id,
      problemDescription,
      paymentStatus: 'unpaid',
      serviceStatus: 'pending',
    }
    const session = yield mongoose_1.default.startSession()
    try {
      yield session.startTransaction()
      const newBooking = yield booking_model_1.default.create([bookingInfo], {
        session,
      })
      if (!newBooking.length) {
        throw new Error('booking failed')
      }
      const updatedAppointment = yield appointment_model_1.default
        .findByIdAndUpdate(
          appointment._id.toString(),
          {
            $inc: {
              remainingSlots: -1,
            },
          },
          { new: true },
        )
        .session(session)
      if (!updatedAppointment) {
        throw new Error('booking failed')
      }
      yield session.commitTransaction()
      yield session.endSession()
      return {
        appointment: updatedAppointment,
        data: newBooking,
      }
    } catch (error) {
      yield session.abortTransaction()
      yield session.endSession()
      throw error
    }
  })
const checkBooking = (appointmentId, phoneNo) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ phoneNo })
    const existedBooking = yield booking_model_1.default.findOne({
      appointmentId,
      userId: user._id,
    })
    return existedBooking
  })
const updateBookingStatus = (bookingId, status) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.default.updateOne(
      {
        _id: bookingId,
        serviceStatus: {
          $in: ['waiting', 'in service'],
        },
      },
      {
        $set: { serviceStatus: status },
      },
      {
        new: true,
      },
    )
    return result
  })
exports.bookingServices = {
  createBooking,
  checkBooking,
  updateBookingStatus,
}
