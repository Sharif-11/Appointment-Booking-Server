import { RequestHandler } from 'express'
import { userServices } from './user.service'
import bcrypt from 'bcrypt'
import { userAuth } from './user.auth'
import jwt from 'jsonwebtoken'
import config from '../../../config'
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
const checkLoginController: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    jwt.verify(token, config.jwt_secret as string, (err, decoded) => {
      if (!err) {
        res.status(200).json({
          status: true,
          message: 'already logged in',
          data: {
            user: decoded,
          },
        })
      } else {
        res.status(500).json({
          status: false,
          message: 'not logged in',
        })
      }
    })
  } else {
    res.status(200).json({
      status: false,
      message: 'not logged in',
    })
  }
}
export const userControllers = { loginController, checkLoginController }
