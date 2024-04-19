console.clear()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/errors/globalErroHandler'
import doctorRoutes from './app/modules/doctor/doctor.route'
import { patientControllers } from './app/modules/patient/patient.controller'
import patientRoutes from './app/modules/patient/patient.route'
import paymentRoutes from './app/modules/payment/payment.route'
import userRoutes from './app/modules/user/user.route'
const app: Application = express()

app.use(express.json())
const allowedOrigins = [
  'http://localhost:5173',
  'http://18.138.71.5:5173',
  'null',
]
const corsOptions = {
  origin: function (origin: string, callback) {
    console.clear()
    console.log({ origin })
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
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
app.use('/api/v1/payment', paymentRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to appointment booking system!!!')
})
app.use(globalErrorHandler)
export default app
