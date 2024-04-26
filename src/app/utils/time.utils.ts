export const getToday = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return today
}
