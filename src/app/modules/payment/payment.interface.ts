import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface IPayment {
  transactionId: string
  amount: number
  date: string
}
export type PaymentModel = Model<IPayment, Record<string, unknown>>
export default IPayment
