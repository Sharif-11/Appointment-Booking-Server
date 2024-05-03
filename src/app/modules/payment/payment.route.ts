import express from 'express'
import { paymentControllers } from './payment.controller'
const paymentRoutes = express.Router()
paymentRoutes.post('/success/:id', paymentControllers.confirmPaymentController)
paymentRoutes.post('/fail/:id', paymentControllers.errorPaymentController)
paymentRoutes.post('/cancel/:id', paymentControllers.errorPaymentController)
export default paymentRoutes
