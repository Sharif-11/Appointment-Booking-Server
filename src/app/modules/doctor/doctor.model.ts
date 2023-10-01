import { Schema, model } from 'mongoose'
import IDoctor, { DoctorModel } from './doctor.interface'

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: true,
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
    toJSON: { virtuals: true },
  },
)
doctorSchema.pre('save', async function (next) {
  const doctor = await this.constructor.findOne({})
  console.log('doctor==', doctor)
  if (!doctor) next()
  else {
    throw new Error('Doctor already exists')
  }
})
const Doctor = model<IDoctor, DoctorModel>('doctor', doctorSchema)
export default Doctor
