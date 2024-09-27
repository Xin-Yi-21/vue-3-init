import { ynGet, siteListGet, siteTypeGet, warnTypeGet, forecastModelTypeGet, forecastFileTypeGet, forecastMeteorologyTypeGet, forecastOutputTypeGet, } from '@/api/common/enums.js'

const useEnumsStore = defineStore('enums', () => {
  // 前端枚举
  const frontendEnums = ref(
    {
      // 月份
      month: [{ label: '1', value: '01' }, { label: '2', value: '02' }, { label: '3', value: '03' }, { label: '4', value: '04' }, { label: '5', value: '05' }, { label: '6', value: '06' }, { label: '7', value: '07' }, { label: '8', value: '08' }, { label: '9', value: '09' }, { label: '10', value: '10' }, { label: '11', value: '11' }, { label: '12', value: '12' },]
    }
  )
  // 后端枚举
  const backendEnums = ref({})
  // 全部枚举
  const allEnums = computed(() => ({ ...frontendEnums.value, ...backendEnums.value }))
  // 获取后端枚举
  function getEnums(refreshType) {
    return new Promise(async (resolve, reject) => {
      try {
        const enums = backendEnums.value
        // 是否
        if (!refreshType || refreshType === 'yn') {
          const res = await ynGet();
          enums.yn = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        // 站点
        if (!refreshType || refreshType === 'site') {
          const res = await siteListGet();
          enums.site = (res.data || []).map(item => ({ label: item.siteName, value: item.siteId }))
        }
        // 站点类型
        if (!refreshType || refreshType === 'siteType') {
          const res = await siteTypeGet();
          enums.siteType = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        // 告警类型  
        if (!refreshType || refreshType === 'warnType') {
          const res = await warnTypeGet();
          enums.warnType = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        // 预报模式
        if (!refreshType || refreshType === 'forecastModelType') {
          const res = await forecastModelTypeGet();
          enums.forecastModelType = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        // 预报气象类型
        if (!refreshType || refreshType === 'forecastMeteorologyType') {
          const res = await forecastMeteorologyTypeGet();
          enums.forecastMeteorologyType = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        // 预报出力类型
        if (!refreshType || refreshType === 'forecastOutputType') {
          const res = await forecastOutputTypeGet();
          enums.forecastOutputType = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        // 预报文件类型
        if (!refreshType || refreshType === 'forecastFileType') {
          const res = await forecastFileTypeGet();
          enums.forecastFileType = (res.data || []).map(item => ({ label: item.label, value: item.value }))
        }
        backendEnums.value = enums
        // console.log('查后端枚举', backendEnums.value)
        // console.log('查全部枚举allEnums', this.allEnums)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
  // return
  return { allEnums, frontendEnums, backendEnums, getEnums }
})

export default useEnumsStore