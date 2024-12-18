import request from '@/utils/request'

export function roleGet(params) {
  return request({
    url: '/',
    method: 'get',
    params
  })
}


export const personGet = () => {
  return new Promise((resolve, reject) => {
    try {
      const data = [
        { personName: '工藤新一', personId: 1, gender: 'male', age: 18, role: '侦探' },
        { personName: '毛利兰', personId: 2, gender: 'female', age: 18, role: '高中生' },
      ]
      resolve({ code: 200, data: data, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}