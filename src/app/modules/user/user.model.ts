import { Schema, model } from 'mongoose'
import IUser, { UserModel } from './user.interface'

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
  },
)
userSchema.pre('save', async function (next) {
  try {
    const existingUser = await this.constructor.findOne({
      phoneNo: this.phoneNo,
    })
    if (existingUser && !existingUser._id.equals(this._id)) {
      throw new Error('Phone number must be unique.')
    }
    next()
  } catch (error) {
    throw error
  }
})
const User = model<IUser, UserModel>('user', userSchema)

export default User
