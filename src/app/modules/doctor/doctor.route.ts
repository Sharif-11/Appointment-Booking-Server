import express from 'express'
import { slotValidators } from './slot/slot.validator'
import { slotControllers } from './slot/slot.controller'
import { authMiddlewares } from '../../middlewares/auth.middleware'
const doctorRoutes = express.Router()
doctorRoutes.use(
  authMiddlewares.verifyTokenMiddleware,
  authMiddlewares.verifyUser('doctor'),
)
doctorRoutes.post(
  '/slot',
  slotValidators.validateSlot,
  slotControllers.createSlotController,
)
doctorRoutes.get('/slots', slotControllers.getSlotsController)
doctorRoutes.delete('/slot/:id', slotControllers.deleteSlotController)

export default doctorRoutes
