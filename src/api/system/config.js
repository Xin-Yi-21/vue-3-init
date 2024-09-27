// let $config = {}
// const setConfig = async (app) => {
//   let projectName
//   switch (import.meta.env.VITE_APP_ENV) {
//     case 'development': projectName = '/qlfy-af'; break;
//     case 'test': projectName = '/qlfy-af'; break;
//     case 'production': projectName = '/qlfy-af'; break;
//   }
//   try {
//     const res = await fetch(`${projectName}/config.json`)
//     $config = await res.json()
//     app.config.globalProperties.development = config.development
//     app.config.globalProperties.VITE_APP_BASE_API = config.VITE_APP_BASE_API
//   } catch (error) { }
// }
// export { setConfig, config }

let $config = {}
const setConfig = async (app) => {
  // let projectName
  // switch (import.meta.env.VITE_APP_ENV) {
  //   case 'development': projectName = '/qlfy-af'; break;
  //   case 'test': projectName = '/qlfy-af'; break;
  //   case 'production': projectName = '/qlfy-af'; break;
  // }
  try {
    const res = await fetch(`${import.meta.env.VITE_APP_PATH}/config.js`)
    const text = await res.text()
    $config = new Function('exports', text + '\nreturn exports')({})
    // console.log('查config', $config)
    app.config.globalProperties.development = $config.development
    app.config.globalProperties.VITE_APP_BASE_API = $config.VITE_APP_BASE_API
  } catch (error) { }
}
export { setConfig, $config }




// 1. 动态配置
// 可变性：通过 API 查询，你可以在不重新构建应用的情况下动态更新配置。例如，您可以根据不同的环境（如开发、测试、生产）提供不同的配置。
// 版本控制：如果配置文件在服务器上更新，用户无需重新部署应用即可获得最新的配置。
// 2. 避免打包问题
// 大文件：直接导入 JSON 文件会将文件内容打包到 JavaScript 文件中，导致应用增大。而使用 API 查询时，只有在运行时才会请求配置，减小了初始加载的文件大小。
// 访问权限：某些配置可能仅在运行时需要，而不是在编译时。通过 API 查询，您可以根据当前环境条件灵活地提供配置信息。
// 3. 提高灵活性
// 多环境支持：当应用部署到多个环境时（如开发、测试、生产），您可能希望在每个环境中加载不同的配置。使用 API 查询可以轻松实现这一点。
// 远程配置：在某些场景下，您可能希望将配置存储在远程服务器上，以便进行集中管理。API 查询可以与后端服务集成，动态加载配置。
// 4. 更好的错误处理
// 运行时错误处理：通过 API 查询加载配置，可以对失败进行更好的处理，例如提供默认配置、重试机制或展示用户友好的错误消息。
// 5. 服务端渲染（SSR）兼容性
// 如果您的应用使用 SSR，API 查询可以确保在服务端生成 HTML 时获取到最新的配置，而不是依赖于构建时的静态内容。



