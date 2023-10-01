import { RequestHandler } from 'express'
import { doctorServices } from './doctor.service'
const createDoctorController: RequestHandler = async (req, res) => {
  await doctorServices
    .createDoctorService(req.body)
    .then(() => {
      res.status(200).json({
        status: true,
        message: 'doctor created successfully',
      })
    })
    .catch(err => {
      res.status(500).json({ status: false, message: err?.message })
    })
}
export const doctorControllers = { createDoctorController }
