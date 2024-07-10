"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const paymentRoutes = express_1.default.Router();
paymentRoutes.post('/success/:id', payment_controller_1.paymentControllers.confirmPaymentController);
paymentRoutes.post('/fail/:id', payment_controller_1.paymentControllers.errorPaymentController);
paymentRoutes.post('/cancel/:id', payment_controller_1.paymentControllers.errorPaymentController);
exports.default = paymentRoutes;
