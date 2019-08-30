import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const LoginKey = 'login-userid-token'

export function getToken() {
  return Cookies.get(TokenKey)
  // return 'admin-token'
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
