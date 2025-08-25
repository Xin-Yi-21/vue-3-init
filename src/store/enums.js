import { cRoleGet, cMonthGet } from '@/api/framework/template-manage/element'         // 框架自定义接口
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
    // 获取月份，初始不查询。
    try {
      if (refreshTypeList?.includes('cMonth')) {
        const res = await cMonthGet()
        enums.month = (res.data || []).map(item => ({ label: item.label, value: item.value, }))
      }
    } catch (error) { ElMessage.warning('月份枚举查询存在问题，请联系管理员！') }

    // 整合
    backendEnums.value = enums
    // console.log('查backendEnums.value', backendEnums.value)
  }
  return { allEnums, frontendEnums, backendEnums, getEnums }
})
export default useEnumsStore