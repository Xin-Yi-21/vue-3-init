import auth from './auth'
import modal from './modal'
import tag from './tag'

export default function installPlugins(app) {
  // 认证对象
  app.config.globalProperties.$auth = auth
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 页签操作
  app.config.globalProperties.$tag = tag
}
