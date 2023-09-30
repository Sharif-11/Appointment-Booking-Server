/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Schema } from 'mongoose'

interface IUser {
  phoneNo: string
  password: string
  role: 'patient' | 'doctor' // You can extend this for other roles
  userId: Schema.Types.ObjectId
}
export type UserModel = Model<IUser, Record<string, unknown>>
export default IUser
