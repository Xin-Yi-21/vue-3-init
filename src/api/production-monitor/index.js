import request from '@/utils/request'

// 获取 数据详情
export function dataDetailGet(params) {
  return request({
    url: '/dataDetail/getDetailByType',
    method: 'get',
    params
  })
}

// 获取 到报率
export function ratioStatGet(params) {
  return request({
    url: '/monitorResult/getYbRatio',
    method: 'get',
    params
  })
}

