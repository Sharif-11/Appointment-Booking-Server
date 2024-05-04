/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import mongoose from 'mongoose'
import Slot from '../../doctor/slot/slot.model'
import { paymentServices } from '../../payment/payment.service'
import { bookingServices } from './booking.service'

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
      .catch(() => {
        throw new Error('payment initiation failed')
      })
  } catch (error: any) {
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
    const { userId: patientId } = req.body
    const existedBooking = await bookingServices.findExistedBooking(
      appointmentId,
      patientId,
    )
    console.log(existedBooking)
    res.status(200).json({
      status: true,
      message: 'existed booking checked successfully',
      data: existedBooking ? existedBooking : false,
    })
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: 'existed booking checking failed',
      errors: [error.message],
    })
  }
}
const cancelBookingController: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params
    const result = await bookingServices.cancelBooking(bookingId)

    res.status(200).json({
      status: true,
      message: 'Booking cancelled successfully',
      data: result ? false : result,
    })
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: 'Booking cancellation failed',
      errors: [error.message],
    })
  }
}
export const bookingControllers = {
  createBookingController,
  checkBookingController,
  cancelBookingController,
}
