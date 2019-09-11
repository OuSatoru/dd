import request from '@/utils/request'

export function scoreList(query) {
  return request({
    url: '/input/list',
    method: 'get',
    params: query
  })
}

