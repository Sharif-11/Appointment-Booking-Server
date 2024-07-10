import { RequestHandler } from 'express'
import mongoose from 'mongoose'
import { createClient } from 'redis'
import { appointmentServices } from '../doctor/appointment/appointment.service'
import Booking from '../patient/booking/booking.model'
import { bookingServices } from '../patient/booking/booking.service'
import { paymentServices } from './payment.service'
const redisClient = createClient()
const connectRedis = async () => await redisClient.connect()
connectRedis()
const confirmPaymentController: RequestHandler = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const { id: bookingId } = req.params
    const { tran_id: transactionId, amount, tran_date: date } = req.body
    const payment = await paymentServices.createPayment(
      {
        transactionId,
        date,
        amount,
      },
      session,
    )
    if (!payment) {
      throw new Error('payment creation failed')
    }
    const updatedSlot = await bookingServices.updateBookingStatus(bookingId, {
      paymentStatus: 'paid',
      paymentId: payment._id,
    })
    if (!updatedSlot) {
      throw new Error('booking update failed')
    }
    const booking = await Booking.findById(bookingId)
    const updatedAppointment =
      await appointmentServices.updateAppointmentSlotCount(
        String(booking?.appointmentId),
        session,
      )
    if (!updatedAppointment) {
      throw new Error('appointment update failed')
    }
    await session.commitTransaction()
    await session.endSession()
    redisClient
      .publish(
        `appointment:${updatedAppointment._id}`,
        JSON.stringify(updatedAppointment),
      )
      .then(() =>
        console.log(
          `Message published on: appointment:${updatedAppointment._id}`,
        ),
      )
      .catch(err => console.log(err?.message))
    const html = `<h1 style="color: green;text-align:center">Payment Successful</h1>`
    res.set('Content-Type', 'text/html')
    res.send(html)
  } catch (error) {
    res.status(500).send({
      status: false,
      message: 'payment confirmation failed',
      errors: [error.message],
    })
  }
}
const errorPaymentController: RequestHandler = async (req, res) => {
  try {
    const { id: bookingId } = req.params
    console.log({ errorId: bookingId })
    await bookingServices.deleteBooking(bookingId)
    const html = `<h1 style="color: red;text-align:center">Payment Failed</h1>`
    res.set('Content-Type', 'text/html')
    res.send(html)
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'payment failed',
      errors: [error.message],
    })
  }
}
export const paymentControllers = {
  confirmPaymentController,
  errorPaymentController,
}
