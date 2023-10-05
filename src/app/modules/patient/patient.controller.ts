import { RequestHandler } from 'express'
import { patientServices } from './patient.service'

const createPatientController: RequestHandler = async (req, res) => {
  await patientServices
    .createPatientService(req.body)
    .then(() => {
      res.status(200).json({
        status: true,
        message: 'patient created successfully',
      })
    })
    .catch(err =>
      res.status(500).json({
        status: false,
        message: 'patient creation failed!!',
        errors: err,
      }),
    )
}
const updatedPatientController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded
    const { familyMembers, ...otherData } = req.body
    const data = await patientServices.updatePatientProfile(phoneNo, otherData)
    res.status(200).json({
      status: true,
      message: 'patient update successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'patient update failed',
      errors: [error.message],
    })
  }
}
const getPatientProfileController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded
    const data = await patientServices.getPatientProfile(phoneNo)
    res.status(200).json({
      status: true,
      message: 'patient profile retreiving successull',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'patient profile finding failed',
      errors: [error.message],
    })
  }
}
const addFamilyMembersController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded
    const { familyMembers } = req.body
    const data = await patientServices.addFamilyMembers(phoneNo, familyMembers)
    res.status(200).json({
      status: true,
      message: 'family members are added successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'family members adding failed',
      errors: [error.message],
    })
  }
}
const getFamilyMembersController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded
    const data = await patientServices.getFamilyMembers(phoneNo)
    res.status(200).json({
      status: true,
      message: 'family members found successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'family members retreiving failed',
    })
  }
}
const removeFamilyMemberController: RequestHandler = async (req, res) => {
  try {
    const { phoneNo } = req.decoded
    const { id } = req.body
    const data = await patientServices.removeFamilyMember(phoneNo, id)
    res.status(200).json({
      status: true,
      message: 'family member removed successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'family member deletion failed',
      errors: [error.message],
    })
  }
}
const getDoctorProfileController: RequestHandler = async (req, res) => {
  try {
    const data = await patientServices.getDoctorProfile()
    res.status(200).json({
      status: true,
      message: 'doctor profile retreived successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'doctor profile retreiving failed',
      errors: [error.message],
    })
  }
}
export const patientControllers = {
  createPatientController,
  updatedPatientController,
  getPatientProfileController,
  addFamilyMembersController,
  getFamilyMembersController,
  removeFamilyMemberController,
  getDoctorProfileController,
}
