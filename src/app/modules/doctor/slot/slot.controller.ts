import { RequestHandler } from 'express'
import { daysOfWeek } from '../doctor.constant'
import ISlot from './slot.interface'
import { slotServices } from './slot.service'

const createSlotController: RequestHandler = async (req, res) => {
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
const getSlotsController: RequestHandler = async (req, res) => {
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
const deleteSlotController: RequestHandler = async (req, res) => {
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
    const today = daysOfWeek[new Date().getDay()]
    const { weekDay } = req.params
    console.log(req.body)
    console.log({ weekDay })
    const data = await slotServices.getSlots(weekDay || today)
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
const getSlotsForAppointmentController: RequestHandler = async (req, res) => {
  try {
    const weekDay = daysOfWeek[new Date().getDay()]
    const data = await slotServices.getSlotsForAppointment(weekDay)
    const response: {
      status: boolean
      message: string
      data: ISlot[]
    } = {
      status: true,
      message: 'Slot retreived successsfully',
      data,
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(500).send({
      status: false,
      message: 'slot retreiving failed',
      errors: [error.message],
    })
  }
}
export const slotControllers = {
  createSlotController,
  getSlotsController,
  deleteSlotController,
  getSlotsOfDayController,
  getSlotsForAppointmentController,
}
