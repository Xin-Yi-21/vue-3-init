// 部署配置文件
const common = {
  VITE_APP_TITLE: 'V3项目初始化系统',
  VITE_APP_PATH: '/A',
}
const ip = {
  'tey': '192.168.120.60:10002',
  'lsd': '192.168.120.37:10002',
  'slx': '192.168.120.19:10002',
  'axk': '192.168.120.34:10002',
  'test_i': '192.168.120.26:10002',                                // 测试内网环境，test_intranet，路径/view
  'test_p': 'y2com.satellite-fama.com.cn:10010',                   // 测试公网环境，test_public，路径/tradeView
  'prod': '',
}
const config = {
  'development': {
    ...common,
    VITE_APP_BASE_API: `http://${ip.test_p}/view`.replace(/\/view$/, '/tradeView'),
    VITE_APP_USER_API: ``,
  },
  'test': {
    ...common,
    VITE_APP_BASE_API: `http://${ip.test_i}/view`.replace(/\/view$/, '/view'),
    VITE_APP_USER_API: ``,
  },
  'production': {
    ...common,
    VITE_APP_BASE_API: `http://${ip.test_p}/view`.replace(/\/view$/, '/tradeview'),
    VITE_APP_USER_API: ``,
  }
}
return config[vEnv.VITE_APP_ENV]

