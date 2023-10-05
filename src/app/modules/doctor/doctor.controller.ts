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
const updateDoctorController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded

    const data = await doctorServices.updateDoctorService(phoneNo, req.body)
    res.status(200).json({
      status: true,
      message: 'doctor info updated successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'doctor info update failed',
      errors: [error.message],
    })
  }
}
export const doctorControllers = {
  createDoctorController,
  updateDoctorController,
}
