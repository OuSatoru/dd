import request from '@/utils/request'

export function scoreList(query) {
  return request({
    url: '/input/list',
    method: 'get',
    params: query
  })
}

export function updateStatOne(row) {
  return request({
    url: '/input/updateOne',
    method: 'post',
    row
  })
}

export function updateStatAll(rows) {
  return request({
    url: '/input/updateAll',
    method: 'post',
    rows
  })
}
