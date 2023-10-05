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
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  this.password = await bcrypt.hash(
    this.password,
    Number(config.salt_round as string),
  )
  const existedUser = await User.findOne({ phoneNo: user.phoneNo })
  if (existedUser) {
    throw new Error('Phone number already in use')
  } else {
    next()
  }
})

const User = model<IUser, UserModel>('User', userSchema)

export default User
