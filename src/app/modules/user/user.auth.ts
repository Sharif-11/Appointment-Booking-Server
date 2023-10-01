import jwt from 'jsonwebtoken'
import config from '../../../config'
const createToken = async (
  phoneNo: string,
  role: 'patient' | 'doctor',
): Promise<string> => {
  const token = jwt.sign({ phoneNo, role }, config.jwt_secret as string, {
    expiresIn: config.jwt_expires,
  })
  return token
}

export const userAuth = { createToken }
