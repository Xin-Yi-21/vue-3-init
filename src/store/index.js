import { createPinia } from 'pinia'
import useMenuStore from '@/store/menu'
import useSettingStore from '@/store/setting'
import useTagStore from '@/store/tag'
import useUserStore from '@/store/user'
import useEnumsStore from '@/store/enums'
import persist from 'pinia-plugin-persistedstate'
const store = createPinia().use(persist)
export default function useStore() {
  return {
    menuStore: useMenuStore(),
    settingStore: useSettingStore(),
    tagStore: useTagStore(),

    userStore: useUserStore(),
    enumsStore: useEnumsStore(),
  }
}
export { store }