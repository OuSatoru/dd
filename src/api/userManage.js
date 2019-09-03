import request from '@/utils/request'

export function fetchUsers(query) {
  return request({
    url: '/users/list',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/users/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/update',
    method: 'post',
    data
  })
}
