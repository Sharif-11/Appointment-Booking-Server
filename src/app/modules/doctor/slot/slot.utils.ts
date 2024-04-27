import mongoose from 'mongoose'
import { SlotTime, weekDays } from './slot.interface'
export const convertTo12HourFormat = (time24: string): string => {
  // Split the time into hours and minutes
  const [hours, minutes] = time24.split(':').map(Number)

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM'

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12 // 0 should be converted to 12 for 12-hour format

  // Format the time in 12-hour format with two-digit hour and minute
  const time12 = `${hours12.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`

  return time12
}
export const convertTo24HourFormat = (time12: string): string => {
  const [timePart, period] = time12.split(' ')
  const [hours, minutes] = timePart.split(':').map(Number)
  let hours24 = hours

  if (period === 'PM' && hours !== 12) {
    hours24 += 12
  } else if (period === 'AM' && hours === 12) {
    hours24 = 0
  }

  const time24 = `${hours24.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`

  return time24
}
async function slotModelValidator(
  weekDay: weekDays,
  startTime: string,
  endTime: string,
  bookingStartTime: string,
  bookingEndTime: string,
): Promise<{
  status: boolean
  message?: string
  data: SlotTime
}> {
  startTime = convertTo24HourFormat(startTime)
  endTime = convertTo24HourFormat(endTime)
  bookingStartTime = convertTo24HourFormat(bookingStartTime)
  bookingEndTime = convertTo24HourFormat(bookingEndTime)
  if (endTime <= startTime) {
    return {
      status: false,
      message: 'startTime must be less than endTime',
      data: { startTime, endTime, bookingStartTime, bookingEndTime },
    }
  } else if (bookingEndTime <= bookingStartTime) {
    return {
      status: false,
      message: 'bookingStartTime must be less than bookingEndTime',
      data: { startTime, endTime, bookingStartTime, bookingEndTime },
    }
  } else if (bookingEndTime > startTime) {
    return {
      status: false,
      message: 'bookingStartTime must be less than or equal to  endTime',
      data: { startTime, endTime, bookingStartTime, bookingEndTime },
    }
  }
  // Additional pre-update validation logic here...
  const overlappingSlot = await mongoose.models.Slot.findOne({
    weekDay,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
    ],
  })

  if (overlappingSlot) {
    return {
      status: false,
      message: 'Slot is overlapped with already existed slot',
      data: { startTime, endTime, bookingStartTime, bookingEndTime },
    }
  }
  return {
    status: true,
    data: { startTime, endTime, bookingStartTime, bookingEndTime },
  }
}
export const slotUtilityFuntions = {
  convertTo12HourFormat,
  convertTo24HourFormat,
  slotModelValidator,
}
