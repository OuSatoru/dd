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

export function getClasses(grade) {
  return request({
    url: '/classes',
    method: 'get',
    params: { grade }
  })
}

export function getExams() {
  return request({
    url: '/exams',
    method: 'get'
  })
}
