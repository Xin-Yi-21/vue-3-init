import request from '@/api/request'

// 菜单属性详解
const eg = {
  name: 'FrameworkSystemManage',        // 路由名称
  path: '/system-manage',               // 路由路径
  component: 'LinkView',                // 路由渲染组件：Layout、ParentView、LinkView、NormalView
  hidden: false,                        // 路由是否菜单隐藏，默认false
  alwaysShow: true,                     // 路由是否在唯一子路由时显示，默认true
  redirect: '/system-manage/user',      // 路由重定向路径
  meta: {                               // 路由元信息
    title: '系统管理',                   // 路由标题
    icon: 'c-menu-manage',              // 路由图标

    cache: false,                       // 路由是否缓存，默认false
    affix: false,                       // 路由是否固定，默认false

    link: null,                         // 路由链接地址，默认null
    linkBlank: false,                   // 路由链接是否新浏览器标签页打开，默认false
    linkVirtual: false,                 // 路由链接组件是否虚拟，默认false

    clickIn: false,                     // 路由是否点入，默认false
    hideIn: [],                         // 路由隐藏区域，默认[],值有'top'和'left'。
    class: [],                          // 路由样式类名,
  },
  children: [],                         // 路由子项
}



// 获取路由
export const menuGet = () => {
  return new Promise((resolve, reject) => {
    try {
      const routes = [
        // 基础框架
        {
          name: 'Framework',
          path: '/framework',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: '/framework/template-manage/element',
          meta: { title: '基础框架', icon: 'c-menu-framework', hideIn: [], },
          children: [
            // 文档管理
            {
              name: 'FrameworkDocumentManage',
              path: '/document-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              meta: { title: '文档管理', icon: 'c-menu-document-manage', hideIn: [], },
              children: [
                {
                  name: 'FrameworkDocumentManageStandard',
                  path: 'standard',
                  component: 'framework/document-manage/standard/index',
                  hidden: false,
                  meta: { title: '前端规范', icon: 'c-menu-document-manage-standard', hideIn: ['top'], },
                },
                {
                  name: 'FrameworkDocumentManageProcess',
                  path: 'process',
                  component: 'ParentView',
                  redirect: '/document-manage/process/develop',
                  hidden: false,
                  meta: { title: '前端进程', icon: 'c-menu-document-manage-process', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkDocumentManageProcessDevelop',
                      path: 'develop',
                      component: 'framework/document-manage/process/develop/index',
                      hidden: false,
                      meta: { title: '前端开发', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageProcessDebug',
                      path: 'debug',
                      component: 'framework/document-manage/process/debug/index',
                      hidden: false,
                      meta: { title: '前端调试', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageProcessDeploy',
                      path: 'deploy',
                      component: 'framework/document-manage/process/deploy/index',
                      hidden: false,
                      meta: { title: '前端部署', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageProcessVersion',
                      path: 'version',
                      component: 'framework/document-manage/process/version/index',
                      hidden: false,
                      meta: { title: '前端版本', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                  ],
                },
                {
                  name: 'FrameworkDocumentManageTool',
                  path: 'tool',
                  component: 'ParentView',
                  redirect: '/document-manage/tool/style',
                  hidden: false,
                  alwaysShow: true,
                  meta: { title: '前端工具', icon: 'c-menu-document-manage-tool', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkDocumentManageToolStyle',
                      path: 'style',
                      component: 'framework/document-manage/tool/style/index',
                      hidden: false,
                      meta: { title: '工具样式', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageToolComponent',
                      path: 'component',
                      component: 'framework/document-manage/tool/component/index',
                      hidden: false,
                      meta: { title: '工具组件', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageToolPlugin',
                      path: 'plugin',
                      component: 'framework/document-manage/tool/plugin/index',
                      hidden: false,
                      meta: { title: '工具插件', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageToolDirective',
                      path: 'directive',
                      component: 'framework/document-manage/tool/directive/index',
                      hidden: false,
                      meta: { title: '工具指令', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageToolUtil',
                      path: 'util',
                      component: 'framework/document-manage/tool/util/index',
                      hidden: false,
                      meta: { title: '工具函数', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                  ],
                },
                {
                  name: 'FrameworkDocumentManageCollaboration',
                  path: 'collaboration',
                  component: 'ParentView',
                  redirect: '/document-manage/collaboration/fronted-prototype-interface',
                  hidden: false,
                  meta: { title: '前端协作', icon: 'c-menu-document-manage-collaboration', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkDocumentManageCollaborationFrontedPrototypeInterface',
                      path: 'fronted-prototype-interface',
                      component: 'framework/document-manage/collaboration/fronted-prototype-interface/index',
                      hidden: false,
                      meta: { title: '前端-原型-界面', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageCollaborationFrontedBackendOperation',
                      path: 'fronted-backend-operation',
                      component: 'framework/document-manage/collaboration/fronted-backend-operation/index',
                      hidden: false,
                      meta: { title: '前端-后端-运维', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                  ],
                },
                {
                  name: 'FrameworkDocumentManageSupport',
                  path: 'support',
                  component: 'ParentView',
                  redirect: '/document-manage/support/vscode',
                  hidden: false,
                  meta: { title: '前端支持', icon: 'c-menu-document-manage-support', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkDocumentManageSupportVscode',
                      path: 'vscode',
                      component: 'framework/document-manage/support/vscode/index',
                      hidden: false,
                      meta: { title: 'Vscode', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkDocumentManageSupportLink',
                      path: 'link',
                      component: 'ParentView',
                      hidden: false,
                      meta: { title: '链接网站', icon: 'c-menu-circle', hideIn: ['top'], },
                      children: [
                        {
                          name: 'ElementPlus',
                          path: 'element-plus',
                          component: 'LinkView',
                          hidden: false,
                          meta: { title: 'Element Plus', icon: 'c-menu-circle', link: 'https://element-plus.org/zh-CN/', linkBlank: false, linkVirtual: false, hideIn: ['top',], }
                        },
                        {
                          name: 'ECharts',
                          path: 'echarts',
                          component: 'LinkView',
                          hidden: false,
                          meta: { title: 'ECharts', icon: 'c-menu-circle', link: 'https://echarts.apache.org/zh/index.html', linkBlank: true, linkVirtual: false, hideIn: ['top',], }
                        },
                        {
                          name: 'AntDesign',
                          path: 'ant-design',
                          component: 'LinkView',
                          hidden: false,
                          meta: { title: 'AntDesign', icon: 'c-menu-circle', link: 'https://www.antdv.com/components/overview-cn', linkBlank: false, linkVirtual: true, linkOpenType: 'self', hideIn: ['top',], }
                        },
                        {
                          name: 'Iconfont',
                          path: 'iconfont',
                          component: 'LinkView',
                          hidden: false,
                          meta: { title: 'Iconfont', icon: 'c-menu-circle', link: 'https://www.iconfont.cn/', linkBlank: true, linkVirtual: true, hideIn: ['top',], }
                        },
                      ]
                    },
                  ],
                },
              ],
            },
            // 模版管理
            {
              name: 'FrameworkTemplateManage',
              path: 'template-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/template-manage/element/comprehensive',
              meta: { title: '模版管理', icon: 'c-menu-template-manage', hideIn: [], clickIn: false },
              children: [
                {
                  name: 'FrameworkTemplateManageElement',
                  path: 'element',
                  component: 'ParentView',
                  redirect: '/framework/template-manage/element/comprehensive',
                  hidden: false,
                  meta: { title: 'element 模板', icon: 'c-menu-template-manage-element', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkTemplateManageElementComprehensive',
                      path: 'comprehensive',
                      component: 'framework/template-manage/element/comprehensive/index',
                      hidden: false,
                      meta: { title: '综合模版', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkTemplateManageElementTypical',
                      path: 'typical',
                      component: 'framework/template-manage/element/typical/index',
                      hidden: false,
                      meta: { title: '典型模版', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                  ],
                },
                {
                  name: 'FrameworkTemplateManageEcharts',
                  path: 'echarts',
                  component: 'framework/template-manage/echarts/basic',
                  hidden: false,
                  meta: { title: 'echarts 模板', icon: 'c-menu-template-manage-echarts', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkTemplateManageEchartsBasic',
                      path: 'basic',
                      component: 'framework/template-manage/echarts/basic/index',
                      hidden: false,
                      meta: { title: '基础模版', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkTemplateManageEchartsUpgrade',
                      path: 'upgrade',
                      component: 'framework/template-manage/echarts/upgrade/index',
                      hidden: false,
                      meta: { title: '进阶模版', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                  ],
                },
                {
                  name: 'FrameworkTemplateManageMap',
                  path: 'map',
                  component: 'framework/template-manage/map/station',
                  hidden: false,
                  meta: { title: 'map 模版', icon: 'c-menu-template-manage-map', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkTemplateManageMapStation',
                      path: 'station',
                      component: 'framework/template-manage/map/station/index',
                      hidden: false,
                      meta: { title: '站点地图', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkTemplateManageMapMeteorology',
                      path: 'meteorology',
                      component: 'framework/template-manage/map/meteorology/index',
                      hidden: false,
                      meta: { title: '气象地图', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkTemplateManageMapTyphoon',
                      path: 'typhoon',
                      component: 'framework/template-manage/map/typhoon/index',
                      hidden: false,
                      meta: { title: '台风地图', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                    {
                      name: 'FrameworkTemplateManageMapThreeDimensional',
                      path: 'three-dimensional',
                      component: 'framework/template-manage/map/three-dimensional/index',
                      hidden: false,
                      meta: { title: '3D地图', icon: 'c-menu-circle', hideIn: ['top'], },
                    },
                  ],
                },
              ]
            },
            // 系统管理
            {
              name: 'FrameworkSystemManage',
              path: 'system-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/system-manage/user',
              meta: { title: '系统管理', icon: 'c-menu-system-manage', hideIn: [], },
              children: [
                {
                  name: 'FrameworkSystemManageUser',
                  path: 'user',
                  component: 'framework/system-manage/user/index',
                  hidden: false,
                  meta: { title: '用户管理', icon: 'c-menu-system-manage-user', hideIn: ['top'], },
                },
                {
                  name: 'FrameworkSystemManageDepartment',
                  path: 'department',
                  component: 'framework/system-manage/department/index',
                  hidden: false,
                  meta: { title: '部门管理', icon: 'c-menu-system-manage-department', hideIn: ['top'], },
                },
                {
                  name: 'FrameworkSystemManageAccess',
                  path: 'access',
                  component: 'framework/system-manage/access/index',
                  hidden: false,
                  meta: { title: '访问管理', icon: 'c-menu-system-manage-access', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkSystemManageService',
                  path: 'service',
                  component: 'framework/system-manage/service/index',
                  hidden: false,
                  meta: { title: '服务管理', icon: 'c-menu-system-manage-service', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkSystemManageFile',
                  path: 'file',
                  component: 'framework/system-manage/file/index',
                  hidden: false,
                  meta: { title: '文件管理', icon: 'c-menu-system-manage-file', hideIn: ['top'], }
                },
              ]
            },
            // 布局管理
            {
              name: 'FrameworkLayoutManage',
              path: '/layout-manage',
              component: 'ParentView',
              redirect: '/layout-manage/adaptaion/normal',
              hidden: false,
              alwaysShow: true,
              meta: { title: '布局管理', icon: 'c-menu-layout-manage', hideIn: [], },
              children: [
                {
                  name: 'FrameworkLayoutManageAdaptation',
                  path: '/adaptaion',
                  component: 'ParentView',
                  redirect: '/layout-manage/adaptaion/normal',
                  hidden: false,
                  alwaysShow: true,
                  meta: { title: '多端适配', icon: 'c-menu-layout-manage-adaptaion', hideIn: ['top'], },
                  children: [
                    {
                      name: 'FrameworkLayoutManageAdaptationNormal',
                      path: 'normal',
                      component: 'framework/layout-manage/adaptaion/normal/index',
                      hidden: false,
                      meta: { title: '常规适配', icon: 'c-menu-circle', hideIn: ['top'], }
                    },
                    {
                      name: 'FrameworkLayoutManageAdaptationBigScreen',
                      path: 'big-screen',
                      component: 'framework/layout-manage/adaptaion/big-screen/index',
                      hidden: false,
                      meta: { title: '大屏适配', icon: 'c-menu-circle', hideIn: ['top'], }
                    },
                    {
                      name: 'FrameworkLayoutManageAdaptaionResponsive',
                      path: 'responsive',
                      component: 'framework/layout-manage/adaptaion/responsive/index',
                      hidden: false,
                      meta: { title: '响应适配', icon: 'c-menu-circle', hideIn: ['top'], }
                    },
                    {
                      name: 'FrameworkLayoutManageAdaptaionMobile',
                      path: 'mobile',
                      component: 'framework/layout-manage/adaptaion/mobile/index',
                      hidden: false,
                      meta: { title: '移动适配', icon: 'c-menu-circle', hideIn: ['top'], }
                    },
                  ],
                },
                {
                  name: 'FrameworkLayoutManageTheme',
                  path: 'theme',
                  component: 'framework/layout-manage/theme/index',
                  hidden: false,
                  meta: { title: '主题样式', icon: 'c-menu-layout-manage-theme', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkLayoutManageNormal',
                  path: 'normal',
                  component: 'framework/layout-manage/normal/index',
                  hidden: false,
                  meta: { title: '常规布局', icon: 'c-menu-layout-manage-normal', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkLayoutManageShowHide',
                  path: 'show-hide',
                  component: 'framework/layout-manage/show-hide/index',
                  hidden: false,
                  meta: { title: '显示隐藏', icon: 'c-menu-layout-manage-show-hide', hideIn: ['top'], }
                },
              ],
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
