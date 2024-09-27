
const env = window.V
const common = {
  VITE_APP_TITLE: '齐鲁风云·智枢  区域数值报分系统',
}
const ip = {
  'slx': '192.168.120.19:9002',
  'zjj': '121.42.244.240:10020',
  'tey': '192.168.120.60:9002',
  'test': '121.42.244.240:10020',
  'prod': '',
}
const config = {
  'development': {
    ...common,
    VITE_APP_BASE_API: `http://${ip.slx}/service`,
    VITE_APP_USER_API: `http://${ip.slx}/user`,
  },
  'test': {
    ...common,
    VITE_APP_BASE_API: `http://${ip.test}/service`,
    VITE_APP_USER_API: `http://${ip.test}/user`,
  },
  'production': {
    ...common,
    VITE_APP_BASE_API: `http://${ip.prod}/service`,
    VITE_APP_USER_API: `http://${ip.prod}/user`,
  }
}
return config[env.VITE_APP_ENV]
