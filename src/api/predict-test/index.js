import request from '@/utils/request'

// 获取图
export function pointResultAndSolarRealGet(data) {
    return request({
        url: '/solarForecastTestResultTable/getPointResultAndSolarReal',
        method: 'post',
        data
    })
}

// 获取表
export function solarForecastTestResultTableGet(data) {
    return request({
        url: '/solarForecastTestResultTable/getSolarForecastTestResultTable',
        method: 'post',
        data
    })
}