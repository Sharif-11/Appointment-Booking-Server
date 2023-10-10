import { Schema, model } from 'mongoose'
import IPayment, { PaymentModel } from './payment.interface'

const paymentSchema = new Schema<IPayment>({
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
})
const Payment = model<IPayment, PaymentModel>('Payment', paymentSchema)
export default Payment
