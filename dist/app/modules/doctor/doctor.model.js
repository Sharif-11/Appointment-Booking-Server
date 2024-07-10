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
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    aboutMe: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 125,
    },
    academicQualifications: [
        {
            degree: {
                type: String,
                required: true,
            },
            institute: {
                type: String,
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
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
doctorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const doctor = yield Doctor.findOne({});
        if (!doctor)
            next();
        else {
            throw new Error('Doctor already exists');
        }
    });
});
const Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
exports.default = Doctor;
