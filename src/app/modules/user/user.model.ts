import { Schema, model } from 'mongoose'
import IUser, { UserModel } from './user.interface'

const userSchema = new Schema<IUser>({
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
})
const User = model<IUser, UserModel>('user', userSchema)
export default User
