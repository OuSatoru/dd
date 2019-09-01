import request from '@/utils/request'

export function login(data) {
  // console.log(process.env.VUE_APP_BASE_API)
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(username) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { username }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}
