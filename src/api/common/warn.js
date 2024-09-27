import request from '@/utils/request'

// 告警滚动列表 获取
export function warnScrollListGet(params) {
  return request({
    url: '/monitorResult/getAllWarnList',
    method: 'get',
    params
  })
}
// 告警列表 获取
export function warnListGet(params) {
  return request({
    url: '/monitorResult/getWarnList',
    method: 'get',
    params
  })
}
// 告警统计 获取
export function warnStatGet(params) {
  return request({
    url: '/monitorResult/getStatisticalNum',
    method: 'get',
    params
  })
}
// 告警 确认解决
export function warnResolveConfirm(data) {
  return request({
    url: '/monitorResult/resolve',
    method: 'post',
    data
  })
}

// 获取 预报时次
export function forecastTimeGet(params) {
  return request({
    url: '/monitorConfig/getYbTimeList',
    method: 'get',
    params
  })
}

// 修改阈值
export function thresholdSet(data) {
  return request({
    url: '/monitorConfig/updateThreshold',
    method: 'post',
    data
  })
}

// 数据补传 时间获取
export function supplementTimeGet(params) {
  return request({
    url: '/monitorResult/getMissTimeList',
    method: 'get',
    params
  })
}

// 数据补传
export function supplementUpload(data) {
  return request({
    url: '/monitorResult/dataRetransmission',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

