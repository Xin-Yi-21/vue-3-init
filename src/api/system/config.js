// let cENV = {}
// const setConfig = async (app) => {
//   try {
//     const res = await fetch(`/config.json`)
//     cENV = await res.json()
//   } catch (error) { }
// }
// export { setConfig, cENV }

let cENV = {}
const setConfig = async (app) => {
  try {
    const res = await fetch(ENV.VITE_APP_ENV === 'development' ? `/config.js` : `./config.js`)
    const text = await res.text()
    cENV = new Function('res', text + '\nreturn res')({})
    // console.log('config.js文件内容', text)
    // console.log('系统自定义配置环境变量', cENV)
    // app.config.globalProperties.development = cENV.development
  } catch (error) {
    console.log('config.js文件读取错误', error)
  }
}
export { setConfig, cENV }

// 1、导入config.js调用封装函数的方式，在构建应用后是静态配置。修改需要重新构建才会生效。
// 2、查询config.js获取文件内容的方式，在构建应用后可动态配置，不需要重新构建。（动态配置，打包灵活，错误处理，ssr渲染兼容）



