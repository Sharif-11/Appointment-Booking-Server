import { RequestHandler } from 'express'
import { patientServices } from './patient.service'
import { userAuth } from '../user/user.auth'

const createPatientController: RequestHandler = async (req, res) => {
  await patientServices
    .createPatientService(req.body)
    .then(async data => {
      const { phoneNo, password, role } = data
      const token = await userAuth.createToken(phoneNo, role, password)
      res.status(200).json({
        status: true,
        message: 'patient created successfully',
        data: { token },
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
export const patientControllers = { createPatientController }
