import User from './user.model'

const findUserByPhone = async (phoneNo: string) => {
  const user = await User.findOne({ phoneNo })
  return user
}
const updateUserPassword = async (phoneNo: string, password: string) => {
  const updatedUser = await User.updateOne({ phoneNo }, { password })
  return updatedUser
}
export const userServices = { findUserByPhone, updateUserPassword }
