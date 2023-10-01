import { Schema, model } from 'mongoose'
import IPatient, { PatientModel } from './patient.interface'

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    familyMembers: [
      {
        name: {
          type: String,
          required: true,
        },
        dateOfBirth: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)
const Patient = model<IPatient, PatientModel>('patient', patientSchema)

export default Patient
