import { RequestHandler } from 'express'
import { slotServices } from './slot.service'

const createSlotController: RequestHandler = async (req, res, next) => {
  try {
    const slot = await slotServices.createSlot(req.body)
    res.status(200).json({
      status: true,
      message: 'slot created successfully',
      data: slot,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'slot creation failed',
      errors: [error?.message],
    })
  }
}
export const slotControllers = { createSlotController }
