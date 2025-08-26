import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import { viteMockServe } from 'vite-plugin-mock'

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  vitePlugins.push(viteMockServe({
    mockPath: 'src/api/mock',
    localEnabled: true,    // 启用本地模拟
  }))
  isBuild && vitePlugins.push(...createCompression(viteEnv))

  // if (!isBuild) {
  //   vitePlugins.push({
  //     name: 'start-node-server',
  //     configureServer: () => {
  //       console.log('Starting Node server...')

  //       // 使用 spawn 启动 Node 服务
  //       const nodeProcess = spawn('node', ['server.js'], { stdio: 'inherit' })

  //       nodeProcess.on('error', (err) => {
  //         console.error(`Error starting Node server: ${err}`)
  //       })

  //       nodeProcess.on('close', (code) => {
  //         if (code !== 0) {
  //           console.log(`Node server exited with code ${code}`)
  //         }
  //       })
  //     }
  //   })
  // }
  return vitePlugins
}
