import request from '@/utils/request'

// 根据发报时间获取预报数据(单点)
export function preDataByFbTimeGet(data) {
  return request({
    url: '/solarPointResult/getPreDataByFbTime',
    method: 'post',
    data
  })
}

// 根据发报时间获取预报数据(区域)
export function regionDataByFbTimeGet(data) {
  return request({
    url: '/solarRegionResult/getRegionDataByFbTime',
    method: 'post',
    data
  })
}

// 发报时间 获取
export function fbTimesGet(data) {
  return request({
    url: '/solarPointResult/getFbTimes',
    method: 'post',
    data
  })
}