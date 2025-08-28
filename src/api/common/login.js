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
export function loginInfoGet() {
  return request({
    url: '/profile',
    method: 'get'
  })
}

// 注册
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

// 获取手机验证码
export function phoneCodeGet(params) {
  return request({
    url: '/register',
    method: 'get',
    params
  })
}



// 修改密码
export function passwordChange(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}




