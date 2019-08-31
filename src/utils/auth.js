import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const LoginKey = 'login-token'

export function getToken() {
  return Cookies.get(TokenKey)
  // return 'admin-token'
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getTokenUser() {
  return Cookies.get(LoginKey)
  // return 'admin-token'
}

export function setTokenUser(login) {
  return Cookies.set(LoginKey, login)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
