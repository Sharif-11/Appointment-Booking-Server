'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.userControllers = void 0
const user_service_1 = require('./user.service')
const bcrypt_1 = __importDefault(require('bcrypt'))
const user_auth_1 = require('./user.auth')
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
const config_1 = __importDefault(require('../../../config'))
const loginController = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { phoneNo, password } = req.body
      const user = yield user_service_1.userServices.findUserByPhone(phoneNo)
      if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
        throw new Error('Invalid credentials')
      }
      const token = yield user_auth_1.userAuth.createToken(phoneNo, user.role)
      res.status(200).json({
        status: true,
        message: 'log in successful',
        data: { token, user },
      })
    } catch (error) {
      res.status(401).json({
        status: false,
        message: error === null || error === void 0 ? void 0 : error.message,
      })
    }
  })
const checkLoginController = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a
    const token =
      (_a = req.headers.authorization) === null || _a === void 0
        ? void 0
        : _a.split(' ')[1]
    if (token) {
      jsonwebtoken_1.default.verify(
        token,
        config_1.default.jwt_secret,
        (err, decoded) => {
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
        },
      )
    } else {
      res.status(200).json({
        status: false,
        message: 'not logged in',
      })
    }
  })
const updatePasswordController = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let { password } = req.body
      const { phoneNo } = req.decoded
      password = yield bcrypt_1.default.hash(
        password,
        Number(config_1.default.salt_round),
      )
      const updatedUser = yield user_service_1.userServices.updateUserPassword(
        phoneNo,
        password,
      )
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
  })
exports.userControllers = {
  loginController,
  checkLoginController,
  updatePasswordController,
}
