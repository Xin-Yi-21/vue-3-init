import { personGet } from '@/api/project/project'

const useEnumsStore = defineStore('enums', () => {
  // 前端枚举
  const frontendEnums = ref(
    {
      // 性别
      gender: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
      // 月份
      month: [{ label: '1', value: '01' }, { label: '2', value: '02' }, { label: '3', value: '03' }, { label: '4', value: '04' }, { label: '5', value: '05' }, { label: '6', value: '06' }, { label: '7', value: '07' }, { label: '8', value: '08' }, { label: '9', value: '09' }, { label: '10', value: '10' }, { label: '11', value: '11' }, { label: '12', value: '12' },]
    },
  )
  // 后端枚举
  const backendEnums = ref({})
  // 全部枚举
  const allEnums = computed(() => ({ ...frontendEnums.value, ...backendEnums.value }))
  // 获取后端枚举
  async function getEnums({ commit, state, }, refreshTypeList) {
    let enums = { ...state.backendEnums }
    try {
      if (!refreshTypeList || refreshTypeList.includes('personGet')) {
        const res = await personGet()
        enums.person = (res.data || []).map(item => ({ label: item.personName, value: item.personId, }))
      }
    } catch (error) { Message.warning('枚举查询存在问题，请联系管理员！') }
  }

  // return
  return { allEnums, frontendEnums, backendEnums, getEnums }
})

export default useEnumsStore