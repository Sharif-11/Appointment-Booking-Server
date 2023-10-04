import { RequestHandler } from 'express'
import { bookingServices } from './booking.service'
import Success, { responseUtility } from '../../response/response.utils'

const createBookingController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded
    const { problemDescription } = req.body
    const { id } = req.params
    const { data, appointment } = await bookingServices.createBooking(
      id,
      phoneNo,
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

export const bookingControllers = {
  createBookingController,
  checkBookingController,
}
