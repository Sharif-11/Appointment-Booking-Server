import { Schema, model } from 'mongoose'
import IDoctor, { DoctorModel } from './doctor.interface'

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    academicQualifications: [
      {
        degree: {
          type: String,
          required: true,
        },
        institute: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)
const Doctor = model<IDoctor, DoctorModel>('doctor', doctorSchema)
export default Doctor
