import User from './user.model'

const findUserByPhone = async (phoneNo: string) => {
  const user = await User.findOne({ phoneNo })
  return user
}
export const userServices = { findUserByPhone }
