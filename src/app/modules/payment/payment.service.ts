import IPayment from './payment.interface'
import Payment from './payment.model'

const createPayment = async (payment: IPayment) => {
  const result = await Payment.create(payment)
  return result
}
export const paymentServices = { createPayment }
