import { RequestHandler } from 'express'
import { paymentServices } from './payment.service'
import mongoose from 'mongoose'
import { appointmentServices } from '../doctor/appointment/appointment.service'
import { slotServices } from '../doctor/slot/slot.service'
import { bookingServices } from '../patient/booking/booking.service'
import Booking from '../patient/booking/booking.model'

const confirmPaymentController: RequestHandler = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const { id: bookingId } = req.params
    const { tran_id: transactionId, amount, tran_date: date } = req.body
    const payment = await paymentServices.createPayment({
      transactionId,
      date,
      amount,
    })
    if (!payment) {
      throw new Error('psyment creation failed')
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
        booking?.appointmentId,
        session,
      )
    if (!updatedAppointment) {
      throw new Error('appointment update failed')
    }
    await session.commitTransaction()
    await session.endSession()
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
export const paymentControllers = { confirmPaymentController }
