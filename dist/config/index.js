'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const dotenv_1 = __importDefault(require('dotenv'))
const path_1 = __importDefault(require('path'))
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') })
exports.default = {
  port: process.env.port,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES,
  salt_round: process.env.SALT_ROUND,
}
