
// 1、导入config.js调用封装函数的方式，在构建应用后是静态配置。修改需要重新构建才会生效。
// 2、查询config.js获取文件内容的方式，在构建应用后可动态配置，不需要重新构建。（动态配置，打包灵活，错误处理，ssr渲染兼容）
// 请求部署配置文件
let cEnv = {}
const setConfig = async (app) => {
  let env = import.meta.env
  try {
    const res = await fetch(`${env.VITE_APP_PATH}/config.js`)
    // const res = await fetch(env.VITE_APP_ENV === 'development' ? `${env.VITE_APP_PATH}/config.js` : `./config.js`)
    const text = await res.text()
    cEnv = new Function('res', text + '\nreturn res')({})
    // console.log('config.js文件内容', text)
    console.log('请求部署配置文件 [src/api/system/config.js] cEnv', cEnv)
  } catch (error) {
    console.log('config.js文件读取错误', error)
  }
}

export { setConfig, cEnv }





