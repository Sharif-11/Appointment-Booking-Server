"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const patientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
const Patient = (0, mongoose_1.model)('Patient', patientSchema);
exports.default = Patient;
