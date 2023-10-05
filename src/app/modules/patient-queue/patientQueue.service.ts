import Booking from '../patient/booking/booking.model'

const getQueuedPatient = async (appointmentId: string) => {
  // const result = await Booking.find({ appointmentId })

  const result = await Booking.find({ appointmentId }).populate({
    path: 'patientId',
    model: 'Patient',
    select: 'name dateOfBirth gender',
    options: { lean: true },
    as: 'patient',
  })

  return result
}
export const patientQueueServices = { getQueuedPatient }
