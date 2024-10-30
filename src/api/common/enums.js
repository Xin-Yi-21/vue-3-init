import request from '@/utils/request'
// const yn=[]
// 是否 获取
export function ynGet(params) {
  return request({
    url: '/enums/getYesOrNo',
    method: 'get',
    params
  })
}





