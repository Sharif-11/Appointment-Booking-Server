'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const cors_1 = __importDefault(require('cors'))
const user_route_1 = __importDefault(require('./app/modules/user/user.route'))
const globalErroHandler_1 = __importDefault(
  require('./app/errors/globalErroHandler'),
)
const doctor_route_1 = __importDefault(
  require('./app/modules/doctor/doctor.route'),
)
const patient_route_1 = __importDefault(
  require('./app/modules/patient/patient.route'),
)
const app = (0, express_1.default)()
app.use((0, cors_1.default)())
app.use(express_1.default.json())
app.use(express_1.default.urlencoded({ extended: true }))
app.use('/api/v1/user', user_route_1.default)
app.use('/api/v1/doctor', doctor_route_1.default)
app.use('/api/v1/patient', patient_route_1.default)
app.get('/', (req, res) => {
  res.send('Welcome to appointment booking system!!!')
})
app.use(globalErroHandler_1.default)
exports.default = app
