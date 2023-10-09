import { RequestHandler } from 'express'
import { bookingServices } from './booking.service'
import { responseUtility } from '../../response/response.utils'
import Patient from '../patient.model'
import User from '../../user/user.model'

const createBookingController: RequestHandler = async (req, res) => {
  try {
    const { problemDescription, userId } = req.body
    const user = await User.findById(userId)
    const patient = await Patient.findById(user!.userId)
    const { id } = req.params
    const { data, appointment } = await bookingServices.createBooking(
      id,
      patient!._id.toString(),
      problemDescription,
    )
    res.status(200).json({
      status: true,
      message: 'Appointment booked successfully',
      data: { booking: data, appointment },
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Appointment booking failed',
      errors: [error.message],
    })
  }
}
const checkBookingController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const { phoneNo } = req.decoded
    // console.log({ appointmentId, phoneNo })
    const data = await bookingServices.checkBooking(id, phoneNo)
    res
      .status(200)
      .json(
        responseUtility.successResponse(
          'slot confirmation success',
          data === null ? false : true,
        ),
      )
  } catch (error) {
    res
      .status(500)
      .json(
        responseUtility.errorResponse(`slot confirmation failed`, [
          error?.message,
        ]),
        [error?.message],
      )
  }
}
const updateBookingStatusController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const { serviceStatus } = req.body
    const data = await bookingServices.updateBookingStatus(id, serviceStatus)
    res.status(200).json({
      status: true,
      message: 'service status updated successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'service status update failed',
      errors: [error.message],
    })
  }
}

export const bookingControllers = {
  createBookingController,
  checkBookingController,
  updateBookingStatusController,
}
