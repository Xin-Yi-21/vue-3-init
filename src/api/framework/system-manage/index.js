import request from '@/api/request'

// 获取角色
export function cRoleGet(params) {
  return new Promise((resolve, reject) => {
    try {
      const data = [
        { label: '管理员', value: 'admin' },
        { label: '编辑者', value: 'editor' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ]
      resolve({ code: 200, data: data, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}