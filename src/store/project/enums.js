import { roleGet, monthGet } from '@/api/framework/project'
import { ElMessage } from 'element-plus'
const useEnumsStore = defineStore('enums', () => {
  // 前端枚举
  const frontendEnums = ref(
    {
      gender: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],   // 性别
    },
  )
  // 后端枚举
  const backendEnums = ref({})
  // 全部枚举
  const allEnums = computed(() => ({ ...frontendEnums.value, ...backendEnums.value }))
  // 获取后端枚举
  async function getEnums(refreshTypeList) {
    let enums = { ...backendEnums.value }
    try {
      if (!refreshTypeList || refreshTypeList.includes('roleGet')) {
        const res = await roleGet()
        enums.role = (res.data || []).map(item => ({ label: item.label, value: item.value, }))
      }
    } catch (error) { ElMessage.warning('角色枚举查询存在问题，请联系管理员！') }

    try {
      if (!refreshTypeList || refreshTypeList.includes('monthGet')) {
        const res = await monthGet()
        enums.month = (res.data || []).map(item => ({ label: item.label, value: item.value, }))
      }
    } catch (error) { ElMessage.warning('月份枚举查询存在问题，请联系管理员！') }
    backendEnums.value = enums
    // allEnums.value = Object.assign({}, frontendEnums.value, backendEnums.value,)
  }
  return { allEnums, frontendEnums, backendEnums, getEnums }
})

export default useEnumsStore