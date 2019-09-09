import request from '@/utils/request'

export function examAdd(data) {
  return request({
    url: '/users/create',
    method: 'post',
    data
  })
}
