import { RequestHandler } from 'express'
import { userServices } from './user.service'
import bcrypt from 'bcrypt'
import { userAuth } from './user.auth'
type Role = 'patient' | 'doctor'
const loginController: RequestHandler = async (req, res, next) => {
  try {
    const { phoneNo, password } = req.body
    const user = await userServices.findUserByPhone(phoneNo)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials')
    }
    const token = await userAuth.createToken(phoneNo, user.role as Role)
    res.status(200).json({
      status: true,
      message: 'log in successful',
      data: { token, user },
    })
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message,
    })
  }
}
export const userControllers = { loginController }
