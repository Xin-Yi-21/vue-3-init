import { createApp } from 'vue'
import App from './App'
const app = createApp(App)
// ⭐ 项目全局配置
window.V = import.meta.env
import { setConfig, cENV } from '@/api/system/config'

// ⭐ element-plus 相关文件
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
app.use(ElementPlus, { locale: locale, })

// ⭐ ant-design 相关文件
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
app.use(Antd)
import { message } from 'ant-design-vue'
app.config.globalProperties.$message = message

// ⭐ svg图标 相关文件 
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/system/SvgIcon'
import elementIcons from '@/components/system/SvgIcon/svgicon'
app.use(elementIcons)
app.component('svg-icon', SvgIcon)

// ⭐ 常用样式
import 'leaflet/dist/leaflet.css'   // leaflet样式
import '@/assets/styles/index.scss' // 全局样式

// ⭐ 常用功能
// ⚡ dayjs
import dayjs from 'dayjs'
app.config.globalProperties.$dayjs = dayjs

// ⭐ 获取全局配置后执行的文件
setConfig(app).then(async () => {
  document.title = cENV.VITE_APP_TITLE
  await import('./utils/request')                            // import('./utils/request')
  await import('./permission')                               // import('./permission')
  const directive = (await import('./directive')).default    // import directive from './directive'
  const plugins = (await import('./plugins')).default        // import plugins from './plugins'
  const store = (await import('./store')).default            // import store from './store'
  const router = (await import('./router')).default          // import router from './router'
  directive(app)
  app.use(plugins)
  app.use(store)
  app.use(router)
  app.mount('#app')
})

export default app

