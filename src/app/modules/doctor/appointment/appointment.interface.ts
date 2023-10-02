/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Schema } from 'mongoose'

interface IAppointment {
  slotId: Schema.Types.ObjectId // Assuming you're using ObjectId as the type for slotId
  date: string
  remainingSlots: number
  status: 'pending' | 'running' | 'closed'
}
export type AppointmentModel = Model<IAppointment, Record<string, unknown>>
export default IAppointment
