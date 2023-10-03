import { RequestHandler } from 'express'
import { appointmentServices } from './appointment.service'

const createAppointmentController: RequestHandler = async (req, res) => {
  try {
    const { slotId } = req.body

    const appointment = await appointmentServices.createAppointment(slotId)
    res.status(200).send({
      status: true,
      message: 'Appointment created successfully',
      data: appointment,
    })
  } catch (error) {
    res.status(500).send({
      status: false,
      message: 'Appointment creation failed',
      errors: [error.message],
    })
  }
}
export const appointmentControllers = { createAppointmentController }
