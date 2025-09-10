import request from '@/api/request'

// 枚举 获取
export function enumsGet(params) {
  return request({
    url: '/',
    method: 'get',
    params
  })
}

// 场站 获取
export function cStationGet(params) {
  return request({
    url: '/mock/cStationGet',
    method: 'get',
    params,
    headers: { base: 'mock', }
  })
}

