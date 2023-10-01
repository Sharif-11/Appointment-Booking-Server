import { RequestHandler } from 'express'
import { doctorServices } from './doctor.service'
import { userAuth } from '../user/user.auth'
const createDoctorController: RequestHandler = async (req, res) => {
  await doctorServices
    .createDoctorService(req.body)
    .then(async user => {
      const { phoneNo, password, role } = user
      const token = await userAuth.createToken(phoneNo, role, password)
      res.status(200).json({
        status: true,
        message: 'doctor created successfully',
        data: { token },
      })
    })
    .catch(err => {
      res.status(500).json({ status: false, message: err?.message })
    })
}
export const doctorControllers = { createDoctorController }
