import jwt from 'jsonwebtoken'
import config from '../../../config'
import bcrypt from 'bcrypt'
const createToken = async (
  phoneNo: string,
  role: 'patient' | 'doctor',
  password: string,
): Promise<string> => {
  password = await bcrypt.hash(password, Number(config.salt_round as string))
  const token = jwt.sign(
    { phoneNo, password, role },
    config.jwt_secret as string,
    {
      expiresIn: config.jwt_expires,
    },
  )
  return token
}

export const userAuth = { createToken }
