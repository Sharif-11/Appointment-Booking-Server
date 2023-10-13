'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
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
const mongoose_1 = __importStar(require('mongoose'))
const slot_utils_1 = require('./slot.utils')
const slotSchema = new mongoose_1.Schema(
  {
    weekDay: {
      type: String,
      enum: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    bookingStartTime: {
      type: String,
      required: true,
    },
    bookingEndTime: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 5,
      max: 250,
    },
    visitingFee: {
      type: Number,
      required: true,
      min: 100,
      max: 2000,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)
// Define a pre-save hook to check for overlapping slots
slotSchema.pre('save', function (next) {
  return __awaiter(this, void 0, void 0, function* () {
    const { startTime, endTime, bookingStartTime, bookingEndTime, weekDay } =
      this
    const { status, message, data } =
      yield slot_utils_1.slotUtilityFuntions.slotModelValidator(
        weekDay,
        startTime,
        endTime,
        bookingStartTime,
        bookingEndTime,
      )
    if (!status) {
      throw new Error(message)
    }
    this.startTime = data.startTime
    this.endTime = data.endTime
    this.bookingStartTime = data.bookingStartTime
    this.bookingEndTime = data.bookingEndTime
    next()
  })
})
slotSchema.post('find', function (docs, next) {
  if (Array.isArray(docs)) {
    // Loop through the documents and convert the time format
    docs.forEach(doc => {
      if (doc.startTime) {
        doc.startTime = slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
          doc.startTime,
        )
      }
      if (doc.endTime) {
        doc.endTime = slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
          doc.endTime,
        )
      }
      if (doc.bookingStartTime) {
        doc.bookingStartTime =
          slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
            doc.bookingStartTime,
          )
      }
      if (doc.bookingEndTime) {
        doc.bookingEndTime =
          slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
            doc.bookingEndTime,
          )
      }
    })
  } else {
    // Single document case
    if (docs.startTime) {
      docs.startTime = slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
        docs.startTime,
      )
    }
    if (docs.endTime) {
      docs.endTime = slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
        docs.endTime,
      )
    }
    if (docs.bookingStartTime) {
      docs.bookingStartTime =
        slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
          docs.bookingStartTime,
        )
    }
    if (docs.bookingEndTime) {
      docs.bookingEndTime =
        slot_utils_1.slotUtilityFuntions.convertTo12HourFormat(
          docs.bookingEndTime,
        )
    }
  }
  next()
})
const Slot = mongoose_1.default.model('Slot', slotSchema)
exports.default = Slot
