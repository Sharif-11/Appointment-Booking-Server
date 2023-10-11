import express from 'express'
import { paymentControllers } from './payment.controller'
const paymentRoutes = express.Router()
paymentRoutes.post('/success/:id', paymentControllers.confirmPaymentController)
export default paymentRoutes
