import request from '@/utils/request'

// 是否 获取
export function ynGet(params) {
  return request({
    url: '/enums/getYesOrNo',
    method: 'get',
    params
  })
}
// 站点列表 获取
export function siteListGet() {
  return request({
    url: '/site/queryList',
    method: 'get',
  })
}
// 站点类型 获取
export function siteTypeGet() {
  return request({
    url: '/enums/getSiteTypeList',
    method: 'get',
  })
}
// 告警类型 获取
export function warnTypeGet(params) {
  return request({
    url: '/enums/getAllWarnList',
    method: 'get',
    params
  })
}
// 预报模式类型 获取
export function forecastModelTypeGet() {
  return request({
    url: '/enums/getYbModelList',
    method: 'get',
  })
}
// 预报文件类型 获取
export function forecastFileTypeGet() {
  return request({
    url: '/enums/getYbFileTypeList',
    method: 'get',
  })
}
// 预报气象类型 获取
export function forecastMeteorologyTypeGet() {
  return request({
    url: '/enums/getYbFeatureList',
    method: 'get',
  })
}
// 预报出力类型 获取
export function forecastOutputTypeGet() {
  return request({
    url: '/enums/getYbTypeList',
    method: 'get',
  })
}






