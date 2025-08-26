import { cRoleGet } from '@/api/framework/system-manage'         // 框架自定义接口
import { cStationGet } from '@/api/common'
import { ElMessage } from 'element-plus'

const useEnumsStore = defineStore('enums', () => {
  // 前端枚举
  const frontendEnums = ref(
    {
      // 性别
      gender: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
      // 月份
      month: [{ label: '一月', value: '01' }, { label: '二月', value: '02' }, { label: '三月', value: '03' }, { label: '四月', value: '04' }, { label: '五月', value: '05' }, { label: '六月', value: '06' }, { label: '七月', value: '07' }, { label: '八月', value: '08' }, { label: '九月', value: '09' }, { label: '十月', value: '10' }, { label: '十一月', value: '11' }, { label: '十二月', value: '12' },],
    },
  )
  // 后端枚举
  const backendEnums = ref({})
  // 全部枚举
  const allEnums = computed(() => ({ ...frontendEnums.value, ...backendEnums.value }))
  // 获取后端枚举
  async function getEnums(refreshTypeList, params) {
    let enums = { ...backendEnums.value }

    // 获取角色
    try {
      if (!refreshTypeList || refreshTypeList?.includes('cRole')) {
        const res = await cRoleGet()
        enums.role = (res.data || []).map(item => ({ label: item.label, value: item.value, }))
      }
    } catch (error) { ElMessage.warning('角色枚举查询存在问题，请联系管理员！') }

    // 获取场站
    try {
      if (!refreshTypeList || refreshTypeList?.includes('cStation')) {
        const res = await cStationGet()
        // 获取场站树
        let treeData = JSON.parse(JSON.stringify(res.data || []))
        function deepTraverse(node) {
          if (!node) return
          node.treeId = node.stationId || node.name + '-' + node.id
          node.treeName = node.stationName || node.name
          if (node.stationType && ['火电', '储能', '核电'].includes(node.stationType)) { node.isDisabled = true }
          if (node.children && Array.isArray(node.children)) { node.children.forEach(child => deepTraverse(child)) }
        }
        treeData.forEach(item => deepTraverse(item))
        enums.stationTree = treeData
        // 获取场站列表
        let listData = []
        function getStations(dataTree) {
          if (!dataTree) return
          for (let i of dataTree) {
            if (!i.children) {
              i.label = i.stationName
              i.value = i.stationId
              i.isDisabled = (i.stationType && ['火电', '储能', '核电'].includes(i.stationType)) ? true : false
              i?.stationName ? listData.push(i) : ''
            } else {
              getStations(i.children)
            }
          }
        }
        getStations(treeData)
        enums.stationList = listData
      }
    } catch (error) { ElMessage.warning('场站枚举查询存在问题，请联系管理员！') }

    // 整合
    backendEnums.value = enums
    // console.log('查backendEnums.value', backendEnums.value)
  }
  return { allEnums, frontendEnums, backendEnums, getEnums }
})

export default useEnumsStore