import express from 'express'
import { authMiddlewares } from '../../middlewares/auth.middleware'
import { bookingControllers } from './booking/booking.controller'

const patientRoutes = express.Router()
patientRoutes.use(
  authMiddlewares.verifyTokenMiddleware,
  authMiddlewares.verifyUser('patient'),
)
patientRoutes.post('/booking/:id', bookingControllers.createBookingController)
export default patientRoutes
