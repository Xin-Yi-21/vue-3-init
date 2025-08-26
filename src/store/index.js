import { createPinia } from 'pinia'
import useMenuStore from '@/store/menu'
import useSettingStore from '@/store/setting'
import useTagStore from '@/store/tag'
import useUserStore from '@/store/user'
import useEnumsStore from '@/store/enums'
import useStationStore from '@/store/station'
import persist from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例并使用持久化插件
const store = createPinia().use(persist)

// 使用 `useStore` 返回所有的 store
export default function useStore() {
  return {
    menuStore: useMenuStore(),
    settingStore: useSettingStore(),
    tagStore: useTagStore(),
    userStore: useUserStore(),
    enumsStore: useEnumsStore(),
    stationStore: useStationStore(),
  }
}

export { store, useStore }
