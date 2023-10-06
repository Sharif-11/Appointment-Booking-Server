import { RequestHandler } from 'express'
import config from '../../config'
import jwt from 'jsonwebtoken'

const verifyTokenMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'No token provided',
    })
  }

  jwt.verify(token, config.jwt_secret as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: 'Failed to authenticate token',
      })
    }
    req.decoded = decoded
    next()
  })
}
const verifyUser = (userRole: 'patient' | 'doctor') => {
  const identifyRole: RequestHandler = (req, res, next) => {
    const { role } = req.decoded
    if (role === userRole) {
      next()
    } else {
      res.status(403).json({
        status: false,
        message: `Failed to authenticate ${userRole}`,
      })
    }
  }
  return identifyRole
}
export const authMiddlewares = { verifyTokenMiddleware, verifyUser }
