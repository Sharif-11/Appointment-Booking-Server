import { RequestHandler } from 'express'
import { bookingServices } from './booking.service'
import Slot from '../../doctor/slot/slot.model'
import { paymentServices } from '../../payment/payment.service'
import mongoose from 'mongoose'

const createBookingController: RequestHandler = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const { name, userId: patientId, phoneNo, email } = req.body.user
    const { problemDescription, slotId } = req.body
    const { id: appointmentId } = req.params
    const booking = await bookingServices.createBooking(
      appointmentId,
      patientId,
      problemDescription,
      session,
    )
    console.log({ slotId })
    if (!booking) {
      throw new Error('Booking creation failed')
    }
    const slot = await Slot.findById(slotId)
    if (!slot) {
      throw new Error('Slot with this id does not exist')
    }
    paymentServices
      .initiatePayment(
        slot.visitingFee,
        booking._id.toString(),
        name,
        email,
        phoneNo,
      )
      .then(async GatewayPageURL => {
        await session.commitTransaction()
        await session.endSession()
        res.status(200).json({
          status: true,
          message: 'Booking created successfully',
          data: { url: GatewayPageURL },
        })
      })
      .catch(err => {
        throw new Error('payment initiation failed')
      })
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    res.status(500).json({
      status: false,
      message: 'Booking creation failed',
      errors: [error.message],
    })
  }
}
const checkBookingController: RequestHandler = async (req, res) => {
  try {
    const { id: appointmentId } = req.params
    const { patientId } = req.body
    const existedBooking = await bookingServices.findExistedBooking(
      appointmentId,
      patientId,
    )
    console.log(existedBooking)
    res.status(200).json({
      status: true,
      message: 'existed booking checked successfully',
      data: Boolean(existedBooking),
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'existed booking checking failed',
      errors: [error.message],
    })
  }
}
export const bookingControllers = {
  createBookingController,
  checkBookingController,
}
