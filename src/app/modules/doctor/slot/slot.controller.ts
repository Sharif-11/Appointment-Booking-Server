import { RequestHandler } from 'express'
import { slotServices } from './slot.service'
import { Error } from 'mongoose'

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
const updateSlotController: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateObject = req.body
    const updatedSlot = await slotServices.updateSlot(id, updateObject)
    res.status(200).json({
      status: true,
      message: 'slot updated successfully',
      data: updatedSlot,
    })
  } catch (error) {
    console.log('update error==', error)
    res.status(500).json({
      status: false,
      message: 'slot update failed',
      errors: [error?.message],
    })
  }
}
export const slotControllers = {
  createSlotController,
  getSlotsController,
  deleteSlotController,
  updateSlotController,
}
