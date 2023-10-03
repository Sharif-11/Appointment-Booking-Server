import { RequestHandler } from 'express'
import { bookingServices } from './booking.service'

const createBookingController: RequestHandler = async (req, res, next) => {
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
export const bookingControllers = { createBookingController }
