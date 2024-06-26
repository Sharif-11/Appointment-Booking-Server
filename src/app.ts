/* eslint-disable @typescript-eslint/no-explicit-any */
console.clear()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/errors/globalErroHandler'
import { appointmentControllers } from './app/modules/doctor/appointment/appointment.controller'
import doctorRoutes from './app/modules/doctor/doctor.route'
import { slotControllers } from './app/modules/doctor/slot/slot.controller'
import { patientControllers } from './app/modules/patient/patient.controller'
import patientRoutes from './app/modules/patient/patient.route'
import paymentRoutes from './app/modules/payment/payment.route'
import userRoutes from './app/modules/user/user.route'

const app: Application = express()

app.use(express.json())

const corsOptions = {
  origin: function (origin: string, callback: any) {
    callback(null, true)
  },
  credentials: true, // Allow credentials
}

// Use CORS middleware
app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/doctor', doctorRoutes)
app.use('/api/v1/patient', patientRoutes)
app.get('/api/v1/doctor-info', patientControllers.getDoctorProfileController)
app.get(
  '/api/v1/appointments',
  appointmentControllers.getUpcomingAppointmentsController,
)
app.get('/api/v1/appointment/:id', appointmentControllers.getAppointment)
app.get('/api/v1/slots/:weekDay', slotControllers.getSlotsOfDayController)
app.use('/api/v1/payment', paymentRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to appointment booking system!!!')
})

app.use(globalErrorHandler)
export default app
