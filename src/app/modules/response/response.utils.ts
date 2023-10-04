const successResponse = (message: string, data: unknown) => {
  return { status: true, message, data }
}
const errorResponse = (message: string, errors: unknown) => {
  return { status: false, message, errors }
}
export const responseUtility = { successResponse, errorResponse }
