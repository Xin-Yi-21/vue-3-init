import request from '@/utils/request'

// 获取路由
export const menuGet = () => {
  return new Promise((resolve, reject) => {
    try {
      const routes = [

        // // 外网链接
        // {
        //   name: 'Website',
        //   path: '/website',
        //   component: 'Layout',
        //   hidden: false,
        //   alwaysShow: true,
        //   redirect: 'noRedirect',
        //   meta: { title: '参考网址', icon: 'c-website', noCache: false, link: null },
        //   children: [
        //     {
        //       name: 'ElementPlus',
        //       path: 'https://element-plus.org/zh-CN',
        //       component: 'Layout',
        //       hidden: false,
        //       meta: { title: 'Element Plus', icon: 'c-element', noCache: false, link: null }
        //     },
        //     {
        //       name: 'ECharts',
        //       path: 'https://echarts.apache.org/zh/index.html',
        //       component: 'Layout',
        //       hidden: false,
        //       meta: { title: 'ECharts', icon: 'c-echarts', noCache: false, link: null }
        //     },
        //   ]
        // },


        // 基础框架
        {
          name: 'Framework',
          path: '/framework',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: 'noRedirect',
          meta: { title: '基础框架', icon: 'c-framework', noCache: false, link: null, menu: ['top', 'left'], },
          children: [
            {
              name: 'TemplateManage',
              path: 'template-manage',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/template-manage/element',
              meta: { title: '模版管理', icon: 'c-template', noCache: false, link: null, menu: ['top', 'left'], },
              children: [
                {
                  name: 'ElementTemplate',
                  path: 'element',
                  component: 'framework/template-manage/element/index',
                  hidden: false,
                  meta: { title: 'element 模板', icon: 'c-element', noCache: false, link: null, menu: ['left'], }
                },
                {
                  name: 'EchartsTemplate',
                  path: 'echarts',
                  component: 'framework/template-manage/echarts/index',
                  hidden: false,
                  meta: { title: 'echarts 模板', icon: 'c-echarts', noCache: false, link: null, menu: ['left'], }
                },
                {
                  name: 'MapTemplate',
                  path: 'map',
                  component: 'framework/template-manage/map/index',
                  hidden: false,
                  meta: { title: 'map 模版', icon: 'c-map', noCache: false, link: null, menu: ['left'], }
                },
                {
                  name: 'SystemTemplate',
                  path: 'system',
                  component: 'framework/template-manage/system/index',
                  hidden: false,
                  meta: { title: 'system 模版', icon: 'c-system', noCache: false, link: null, menu: ['left'], }
                },
              ]
            },
          ]
        },


      ]
      resolve({ code: 200, data: routes, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}
