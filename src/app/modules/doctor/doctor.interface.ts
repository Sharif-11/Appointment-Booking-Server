import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface IDoctor {
  name: string
  designation: string
  email: string
  aboutMe: string
  academicQualifications?: [
    {
      degree: string
      institute: string
      startTime: string
      endTime: string
    },
  ]
}
export type DoctorModel = Model<IDoctor, Record<string, unknown>>
export default IDoctor
