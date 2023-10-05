/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Schema } from 'mongoose'

interface IBooking {
  appointmentId: Schema.Types.ObjectId
  patientId: Schema.Types.ObjectId
  paymentId?: Schema.Types.ObjectId
  problemDescription?: string
  paymentStatus: 'paid' | 'unpaid'
  serviceStatus: 'pending' | 'in service' | 'waiting' | 'served'
}
export type BookingModel = Model<IBooking, Record<string, unknown>>
export default IBooking
