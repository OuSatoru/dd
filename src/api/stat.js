import request from '@/utils/request'

export function examGradeList(query) {
  return request({
    url: '/stat/examGradeList',
    method: 'get',
    params: query
  })
}

export function examStuList(query) {
  return request({
    url: '/stat/examStuList',
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
