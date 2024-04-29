import mongoose from 'mongoose'
import Booking from '../patient/booking/booking.model'

const getQueuedPatient = async (appointmentId: string) => {
  const result = await Booking.aggregate([
    { $match: { appointmentId: new mongoose.Types.ObjectId(appointmentId) } },
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patient',
      },
    },
    { $unwind: '$patient' }, // Unwind the patient array
    {
      $addFields: {
        serviceStatusOrder: {
          $switch: {
            branches: [
              { case: { $eq: ['$serviceStatus', 'in service'] }, then: 1 },
              { case: { $eq: ['$serviceStatus', 'waiting'] }, then: 2 },
              { case: { $eq: ['$serviceStatus', 'served'] }, then: 3 },
            ],
            default: 4, // Default to a higher value for other statuses
          },
        },
      },
    },
    { $sort: { serviceStatusOrder: 1 } }, // Sort based on the new field
    {
      $project: {
        _id: 1,
        name: '$patient.name',
        dateOfBirth: '$patient.dateOfBirth',
        email: '$patient.email',
        appointmentId: 1, // Include appointmentId field
        serviceStatus: 1, // Include serviceStatus field
        // Add other fields if needed
      },
    },
  ])

  return result
}
const updateServiceStatus = async (bookingId: string) => {
  // Get the booking to update
  const bookingToUpdate = await Booking.findById(bookingId)
  if (!bookingToUpdate) {
    throw new Error('Booking not found')
  } else if (bookingToUpdate.serviceStatus === 'served') {
    throw new Error('This booking is already served')
  } else if (bookingToUpdate.serviceStatus === 'in service') {
    const result = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { serviceStatus: 'served' },
      },
      { new: true },
    )
    return result
  } else {
    const existingBooking = await Booking.findOne({
      appointmentId: bookingToUpdate.appointmentId,
      serviceStatus: 'in service',
    })
    if (existingBooking) {
      throw new Error('There is already a patient in service')
    }
    const result = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { serviceStatus: 'in service' },
      },
      { new: true },
    )
    return result
  }
}
export const patientQueueServices = { getQueuedPatient, updateServiceStatus }
