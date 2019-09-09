import request from '@/utils/request'

export function examAdd(data) {
  return request({
    url: '/examAdd',
    method: 'post',
    data
  })
}

export function getSubjects() {
  return request({
    url: '/subjects',
    method: 'get'
  })
}
