import { RequestHandler } from 'express'
import IDoctor from './doctor.interface'
import { doctorServices } from './doctor.service'
const createDoctorController: RequestHandler = async (req, res) => {
  const { name, email, academicQualifications, designation }: IDoctor = req.body
  await doctorServices
    .createDoctorService({
      name,
      email,
      designation,
      academicQualifications,
    })
    .then(doctor => {
      res.status(200).json({
        status: true,
        message: 'doctor created successfully',
        data: doctor,
      })
    })
    .catch(err => {
      res.status(500).json({ status: false, message: err?.message })
    })
}
export const doctorControllers = { createDoctorController }
