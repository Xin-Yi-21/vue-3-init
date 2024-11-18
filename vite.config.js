import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'

export default defineConfig(async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())                                   // 加载相应环境变量
  return {
    base: env.VITE_APP_PATH,                                                  // vite默认应用部署在域名的根路径，指定其子路径
    // base: env.VITE_APP_ENV === 'development' ? env.VITE_APP_PATH : '',       // 使用相对路径
    plugins: createVitePlugins(env, command === 'build'),                    // 根据传入的参数（环境变量和构建命令,server-开发模式，build-生产模式，是否处于构建模式）创建和返回一个插件数组。
    build: {
      outDir: 'dist',                                                        // 设置打包文件夹名称
    },
    resolve: {
      // 设置模块解析的路径和别名
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      },
      // 导入模块可省略的文件扩展名
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 定义开发服务器行为
    server: {
      port: 8080,
      host: true,                                                            // 允许本地网络访问。
      hmr: true,                                                             // 启用热模块替换（Hot Module Replacement）。应用运行时更新模块，无需完全重新加载页面，修改代码后看到效果。
      open: true,                                                            // 自动将开发服务器url在默认浏览器启动。
      proxy: {                                                               // 设置代理，解决跨域请求
        '/dev-api': {                                                        // 需要被代理的路径前缀。
          target: 'http://localhost:8080',                                   // 代理的目标地址。
          changeOrigin: true,                                                // 设置为true请求头的origin会更改为代理的目标地址
          rewrite: (p) => p.replace(/^\/dev-api/, '')                        // 请求路径以/dev-api开头，替换为空字符串。
        }
      }
    },
    // 设置css相关选项
    css: {
      // 配置postcss插件行为
      postcss: {
        plugins: [
          // 移除css的@charset声明
          {
            postcssPlugin: 'internal:charset-removal',   // 
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    define: {
      ENV: env
    }
  }
})
