
const ENV = window.V
const common = {
  VITE_APP_TITLE: 'V3项目初始化系统',
  VITE_APP_PATH: '/A',
}
const ip = {
  'slx': '192.168.120.19:8080',
  'zjj': '121.42.244.240:10020',
  'tey': '192.168.120.60:9002',
  'test': '192.168.120.19:9002',
  'prod': '192.168.120.19:9002',
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

return config[ENV.VITE_APP_ENV]

