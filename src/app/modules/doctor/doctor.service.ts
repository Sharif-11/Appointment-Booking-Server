import IDoctor from './doctor.interface'
import Doctor from './doctor.model'

const createDoctorService = async (data: IDoctor): Promise<IDoctor | null> => {
  const newDoctor = await Doctor.create(data)
  console.log(newDoctor)
  return newDoctor
}
export const doctorServices = { createDoctorService }
