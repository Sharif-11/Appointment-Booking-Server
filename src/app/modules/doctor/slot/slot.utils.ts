const convertTo12HourFormat = (time24: string): string => {
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
const convertTo24HourFormat = (time12: string): string => {
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

export const slotUtilityFuntions = {
  convertTo12HourFormat,
  convertTo24HourFormat,
}
