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
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'patient queue retreiving failed',
      errors: [error.message],
    })
  }
}
export const patientQueueControllers = { getQueuedPatientController }
