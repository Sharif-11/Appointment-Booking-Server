import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface IDoctor {
  name: string
  designation: string
  email: string
  academicQualifications: [
    {
      degree: string
      institute: string
    },
  ]
}
export type DoctorModel = Model<IDoctor, Record<string, unknown>>
export default IDoctor
