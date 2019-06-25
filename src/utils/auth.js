const localStorage = window.localStorage
const USER_KEY = 'user_info'

export const getUser = () => {
  return JSON.parse(localStorage.getItem(USER_KEY))
}
export const saveUser = (data) => {
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}
export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}
