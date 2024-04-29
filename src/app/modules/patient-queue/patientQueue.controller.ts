/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { patientQueueServices } from './patientQueue.service'

const getQueuedPatientController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const data = await patientQueueServices.getQueuedPatient(id)
    res.status(200).json({
      status: true,
      message: 'patient queue retreived successfully',
      data,
    })
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'patient queue retreiving failed',
      errors: [error.message],
    })
  }
}
const updateServiceStatusController: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params
    const data = await patientQueueServices.updateServiceStatus(bookingId)
    res.status(200).json({
      status: true,
      message: 'Service status updated successfully',
      data,
    })
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'Service status updating failed',
      errors: [error.message],
    })
  }
}
export const patientQueueControllers = {
  getQueuedPatientController,
  updateServiceStatusController,
}
