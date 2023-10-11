import mongoose from 'mongoose'
import config from '../../../config'
import IPayment from './payment.interface'
import Payment from './payment.model'
import SSLCommerzPayment from 'sslcommerz-lts'
import { bookingServices } from '../patient/booking/booking.service'
import IBooking from '../patient/booking/booking.interface'
import Appointment from '../doctor/appointment/appointment.model'
import { appointmentServices } from '../doctor/appointment/appointment.service'

const createPayment = async (
  payment: IPayment,
  session: mongoose.mongo.ClientSession,
) => {
  const result = await Payment.create([payment], { session })
  return result[0]
}
const initiatePayment = async (
  amount: number,
  bookingId: string,
  name: string,
  email: string,
  phoneNo: string,
) => {
  console.log({ amount, bookingId, name, email, phoneNo })
  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: 'REF123', // use unique tran_id for each api call
    success_url: 'http://localhost:5000/api/v1/payment/success/' + bookingId,
    fail_url: 'http://localhost:5000/api/v1/payment/fail/' + bookingId,
    cancel_url: 'http://localhost:5000/api/v1/payment/cancel/' + bookingId,
    ipn_url: 'http://localhost:5000/api/v1/payment/ipn/' + bookingId,
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: name,
    cus_email: email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: phoneNo,
    cus_fax: '01711111111',
    ship_name: name,
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  }

  const sslcz = new SSLCommerzPayment(config.ssl_id, config.ssl_password, false)
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    try {
      const apiResponse = await sslcz.init(data)
      const GatewayPageURL = apiResponse.GatewayPageURL
      resolve(GatewayPageURL)
    } catch (error) {
      reject(error)
    }
  })
}
const confirmPayment = async (paymentData: IPayment, bookingId: string) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const newPayment = await Payment.create([paymentData], { session })
    if (!newPayment.length) {
      throw new Error('payment creation failed')
    }
    const updateObj: Partial<IBooking> = {
      paymentId: newPayment._id,
      paymentStatus: 'paid',
    }
    const updateBooking = await bookingServices.updateBookingStatus(
      bookingId,
      updateObj,
      session,
    )
    if (!updateBooking) {
      throw new Error('update booking failed')
    }
    const appointment = await Appointment.findById(updateBooking.appointmentId)

    const updatedAppointment =
      await appointmentServices.updateAppointmentSlotCount(
        appointment?._id,
        session,
      )
    await session.commitTransaction()
    await session.endSession()
  } catch (error) {}
}
export const paymentServices = {
  createPayment,
  initiatePayment,
  confirmPayment,
}
