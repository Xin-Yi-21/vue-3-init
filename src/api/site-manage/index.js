import request from '@/utils/request'

// 站点列表 查询
export function siteListGet(params) {
  return request({
    url: '/site/queryList',
    method: 'get',
    params
  })
}

// 站点 添加
export function siteAdd(data) {
  return request({
    url: '/site/add',
    method: 'post',
    data
  })
}

// 站点预报 修改
export function siteUpdate(data) {
  return request({
    url: '/site/update',
    method: 'post',
    data
  })
}

// 站点 删除
export function siteDelete(data) {
  return request({
    url: '/site/delete',
    method: 'post',
    data
  })
}

// 站点预报 开启
export function siteForecastStart(data) {
  return request({
    url: '/site/enable',
    method: 'post',
    data
  })
}

// 站点预报 关闭
export function siteForecastEnd(data) {
  return request({
    url: '/site/disable',
    method: 'post',
    data
  })
}

