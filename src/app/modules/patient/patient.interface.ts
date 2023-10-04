import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface IFamilyMember {
  name: string
  dateOfBirth: string // You can use a Date object if needed
}

interface IPatient {
  name: string
  dateOfBirth: string // You can use a Date object if needed
  email: string
  familyMembers: IFamilyMember[]
}
export interface IPatientWithoutFamilyMembersOptional {
  name?: string
  dateOfBirth?: string
  email?: string
}
export type PatientModel = Model<IPatient, Record<string, unknown>>
export default IPatient
