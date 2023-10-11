console.clear()
import express, { Application, Response, Request } from 'express'
import cors from 'cors'
import userRoutes from './app/modules/user/user.route'
import globalErrorHandler from './app/errors/globalErroHandler'
import doctorRoutes from './app/modules/doctor/doctor.route'
import patientRoutes from './app/modules/patient/patient.route'
import cookieParser from 'cookie-parser'
import paymentRoutes from './app/modules/payment/payment.route'
const app: Application = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }),
)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/doctor', doctorRoutes)
app.use('/api/v1/patient', patientRoutes)
app.use('/api/v1/payment', paymentRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to appointment booking system!!!')
})
app.use(globalErrorHandler)
export default app
