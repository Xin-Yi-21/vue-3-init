import { regular } from '@/utils/regular.js'

// 账号验证
const accountVerify = (rule, value, callback) => {
    if (!value) {
        callback(new Error('账号不能为空'))
    } else if (!regular.account.test(value)) {
        callback(new Error('请输入4-16位账号，可包含字母数字下划线'))
    } else {
        callback()
    }
}

// 手机号验证
export function mobileVerify(rule, value, callback) {
    if (!value) {
        // callback(new Error('手机号不能为空'))
        callback()
    } else if (!regular.mobile.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
    } else {
        callback()
    }
}
// 邮箱验证
export function emailVerify(rule, value, callback) {
    if (!value) {
        callback(new Error('邮箱不能为空'))
    } else if (!regular.email.test(value)) {
        callback(new Error('请输入正确格式的邮箱'))
    } else {
        callback()
    }
}
// 密码验证
export function passwordVerify(rule, value, callback) {
    if (!value) {
        callback(new Error('密码不能为空'))
    } else if (!regular.password.test(value)) {
        callback(new Error('密码必须包含字母和数字，且在6-18位之间'))
    } else {
        callback()
    }
}
// 确认密码验证
export function equalToPassword(rule, value, callback, prePassword) {
    // let prePassword = rule.prePassword()
    if (!value) {
        callback(new Error('密码不能为空'))
    } else if (!regular.password.test(value)) {
        callback(new Error('密码必须包含字母和数字，且在6-18位之间'))
    } else if (prePassword !== value) {
        callback(new Error("两次输入的密码不一致"))
    } else {
        callback()
    }
}

// 数字验证
export function numberVerify(rule, value, callback) {
    let limit = rule.limit
    let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/
    if (!value) { callback(new Error('不能为空')) }
    else if (!exp.test(value)) { callback(new Error('请输入数字')) }
    else if (limit && (Number(value) < limit[0] || Number(value) > limit[1])) { callback(new Error('数值介于' + limit[0] + '~' + limit[1] + '之间')) }
    else { callback() }
}

// 费用
export function costNumberVerify(rule, value, callback) {
    let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/
    if (value) {
        if (!exp.test(value)) { callback(new Error('请输入数字')) }
        else if (value && Number(value) < 0) {
            callback(new Error("请输入非负数"))
        } else {
            callback()
        }
    } else {
        callback()
    }
}
