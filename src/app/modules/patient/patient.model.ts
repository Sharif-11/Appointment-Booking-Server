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
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)
const Patient = model<IPatient, PatientModel>('Patient', patientSchema)

export default Patient
