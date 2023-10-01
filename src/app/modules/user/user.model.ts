import { Schema, model } from 'mongoose'
import IUser, { UserModel } from './user.interface'
import config from '../../../config'
import bcrypt from 'bcrypt'
const userSchema = new Schema<IUser>(
  {
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'role',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.salt_round as string),
    err => {
      console.log('hash error===', err)
    },
  )
  next()
})

const User = model<IUser, UserModel>('user', userSchema)

export default User
