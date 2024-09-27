import auth from './auth'
import modal from './modal'

export default function installPlugins(app) {
  // 认证对象
  app.config.globalProperties.$auth = auth
  // 模态框对象
  app.config.globalProperties.$modal = modal
}
