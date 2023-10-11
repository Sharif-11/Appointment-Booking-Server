import { RequestHandler } from 'express'
import { userServices } from './user.service'
import bcrypt from 'bcrypt'
import { userAuth } from './user.auth'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import User from './user.model'
type Role = 'Patient' | 'Doctor'
const loginController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.body
    const user = await userServices.findUserByPhone(phoneNo)
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw new Error('Phone number or password is wrong')
    }
    const token = await userAuth.createToken(phoneNo, user.role as Role)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, userId, ...others } = await User.findOne({
      phoneNo,
    })
      .populate('userId')
      .lean()
    const { role } = others
    const { _id, ...rest } = userId
    const userInfo = {
      userId: _id,
      _id: others._id,
      role,
      phoneNo,
      ...rest,
    }
    res.cookie('token', token, {
      maxAge: 30 * 24 * 3600 * 1000,
      httpOnly: true,
    })

    res.json({
      status: true,
      message: 'log in successful',
      data: userInfo,
    })
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message,
    })
  }
}
const checkLoginController: RequestHandler = async (req, res) => {
  const token = req.cookies.token
  if (token) {
    jwt.verify(token, config.jwt_secret as string, async (err, decoded) => {
      if (!err) {
        const { phoneNo } = decoded
        const { password, userId, ...others } = await User.findOne({
          phoneNo,
        })
          .populate('userId')
          .lean()
        const { role } = others
        const { _id, ...rest } = userId
        const userInfo = {
          userId: _id,
          _id: others._id,
          role,
          phoneNo,
          ...rest,
        }
        res.status(200).json({
          status: true,
          message: 'already logged in',
          data: userInfo,
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
const updatePasswordController: RequestHandler = async (req, res) => {
  try {
    let { password } = req.body
    const { phoneNo } = req.decoded
    password = await bcrypt.hash(password, Number(config.salt_round as string))
    const updatedUser = await userServices.updateUserPassword(phoneNo, password)
    res.status(200).json({
      status: true,
      message: 'password updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'password update failed',
    })
  }
}
const logoutController: RequestHandler = async (req, res) => {
  res.clearCookie('token')
  res.redirect('/')
}
export const userControllers = {
  loginController,
  checkLoginController,
  updatePasswordController,
  logoutController,
}
