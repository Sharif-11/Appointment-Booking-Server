import { RequestHandler } from 'express'
import { patientServices } from './patient.service'

const createPatientController: RequestHandler = async (req, res) => {
  await patientServices
    .createPatientService(req.body)
    .then(() => {
      res.status(200).json({
        status: true,
        message: 'patient created successfully',
      })
    })
    .catch(err =>
      res.status(500).json({
        status: false,
        message: 'patient creation failed!!',
        errors: err,
      }),
    )
}

export const patientControllers = {
  createPatientController,
}
