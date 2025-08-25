import request from '@/api/request'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    headers: { isToken: false },
    data
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
    headers: { isUserSystem: true },
  })
}

// 获取图片验证码
export function imageCodeGet() {
  return request({
    url: '/captchaImage',
    method: 'get',
    headers: { isToken: false, isUserSystem: true },
    timeout: 20000
  })
}

// 获取当前登录用户信息
export function getInfo() {
  return request({
    url: '/profile',
    method: 'get'
  })
}

// 注册
export function register() {
  return request({
    url: '/profile',
    method: 'get'
  })
}



