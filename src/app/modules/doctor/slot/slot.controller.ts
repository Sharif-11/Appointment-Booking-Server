import { RequestHandler } from 'express'
import { slotServices } from './slot.service'
import { Error } from 'mongoose'

const createSlotController: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body)
    console.log(req.headers.authorization)
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
const getSlotsController: RequestHandler = async (req, res, next) => {
  try {
    const allSlots = await slotServices.getAllSlot()
    res.status(200).json({
      status: true,
      message: 'retreiving slots successfull',
      data: allSlots,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'retreiving slots failed',
      errors: [error?.message],
    })
  }
}
const deleteSlotController: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedSlot = await slotServices.deleteSlot(id)
    res.status(200).json({
      status: true,
      message: 'slot deletion successfull',
      data: deletedSlot,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'slot deletion failed',
      data: [error.message],
    })
  }
}
const getSlotsOfDayController: RequestHandler = async (req, res) => {
  try {
    const { weekDay } = req.body
    console.log(req.body)
    console.log({ weekDay })
    const data = await slotServices.getSlots(weekDay)
    res.status(200).json({
      status: true,
      message: 'slots retreived successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'slots retreiving failed',
      errors: [error.message],
    })
  }
}
export const slotControllers = {
  createSlotController,
  getSlotsController,
  deleteSlotController,
  getSlotsOfDayController,
}
