import { Model } from 'mongoose'

/* eslint-disable @typescript-eslint/consistent-type-definitions */

interface IPatient {
  name: string
  dateOfBirth: string // You can use a Date object if needed
  email: string
  gender?: 'male' | 'female' | 'others'
}
export interface IPatientWithoutFamilyMembersOptional {
  name?: string
  dateOfBirth?: string
  email?: string
  gender?: string
}
export type PatientModel = Model<IPatient, Record<string, unknown>>
export default IPatient
