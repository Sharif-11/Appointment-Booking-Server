import express, { Application, Response, Request } from 'express'
import cors from 'cors'
import userRoutes from './app/modules/user/user.route'
import User from './app/modules/user/user.model'
import mongoose from 'mongoose'
import globalErrorHandler from './app/errors/globalErroHandler'
import doctorRoutes from './app/modules/doctor/doctor.route'
import patientRoutes from './app/modules/patient/patient.route'

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/doctor', doctorRoutes)
app.use('/api/v1/patient', patientRoutes)
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to appointment booking system!!!')
})
app.use(globalErrorHandler)
export default app
