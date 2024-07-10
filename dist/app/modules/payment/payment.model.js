"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
});
const Payment = (0, mongoose_1.model)('Payment', paymentSchema);
exports.default = Payment;
