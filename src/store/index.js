import { createPinia } from 'pinia'
import useMenuStore from '@/store/framework/menu'
import useSettingStore from '@/store/framework/setting'
import useTagStore from '@/store/framework/tag'
import useUserStore from '@/store/project/user'
import useEnumsStore from '@/store/project/enums'
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