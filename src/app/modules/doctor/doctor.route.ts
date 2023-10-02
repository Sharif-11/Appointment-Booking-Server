import express from 'express'
import { slotValidators } from './slot/slot.validator'
import { slotControllers } from './slot/slot.controller'
const doctorRoutes = express.Router()
doctorRoutes.post(
  '/slot',
  slotValidators.validateSlot,
  slotControllers.createSlotController,
)
export default doctorRoutes
