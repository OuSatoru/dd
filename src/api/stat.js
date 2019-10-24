import request from '@/utils/request'

export function examGradeList(query) {
  return request({
    url: '/stat/examGradeList',
    method: 'get',
    params: query
  })
}

export function getStudents() {
  return request({
    url: '/students',
    method: 'get'
  })
}
