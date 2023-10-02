import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
type weekDays =
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
export type SlotModel = Model<ISlot, Record<string, unknown>>
export default ISlot
