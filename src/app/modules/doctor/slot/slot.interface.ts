import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type weekDays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
interface ISlot {
  weekDay: weekDays
  startTime: string
  endTime: string
  bookingStartTime: string
  bookingEndTime: string
  capacity: number
  visitingFee: number
}
export type SlotTime = {
  startTime: string
  endTime: string
  bookingStartTime: string
  bookingEndTime: string
}
export interface OptionalSlot extends Partial<ISlot> {}
export type SlotModel = Model<ISlot, Record<string, unknown>>
export default ISlot
