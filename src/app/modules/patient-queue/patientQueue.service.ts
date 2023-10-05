import Booking from '../patient/booking/booking.model'

const getQueuedPatient = async (
  appointmentId: string,
  familyMemberId?: string,
) => {
  if (familyMemberId) {
    const result = await Booking.find({ appointmentId })
  } else {
    const result = await Booking.find({ appointmentId }).populate({
      path: 'patientId',
      model: 'Patient', // The name of the model to populate from
      select: 'name email ', // Optional: Select specific fields from the user model
      // Rename the populated field to 'userDetails' in the result
      as: 'patientDetails',
    }) // This will populate 'userId' with user data from the 'user' collection
    return result
  }
}
export const patientQueueServices = { getQueuedPatient }
