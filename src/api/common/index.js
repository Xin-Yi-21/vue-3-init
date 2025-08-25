import request from '@/api/request'

// 公共枚举 获取
export function enumsGet(params) {
  return request({
    url: '/',
    method: 'get',
    params
  })
}

