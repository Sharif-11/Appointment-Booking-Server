import { RequestHandler } from 'express'
import config from '../../config'
import jwt from 'jsonwebtoken'

const verifyTokenMiddleware: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

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
    console.log('decoded===', decoded)
    next()
  })
}
export const middlewares = { verifyTokenMiddleware }
