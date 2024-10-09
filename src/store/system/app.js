import Cookies from 'js-cookie'

const useAppStore = defineStore('app', {
  state: () => ({
    leftNav: {
      isExpand: Cookies.get('leftNavStatus') ? !!+Cookies.get('leftNavStatus') : true,
      withoutAnimation: false,
      isHide: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'default'
  }),
  actions: {
    toggleLeftNav(withoutAnimation) {
      if (this.leftNav.isHide) { return false }
      this.leftNav.isExpand = !this.leftNav.isExpand
      this.leftNav.withoutAnimation = withoutAnimation
      Cookies.set('leftNavStatus', this.leftNav.isExpand ? true : false)
    },
    closeLeftNav({ withoutAnimation }) {
      Cookies.set('leftNavStatus', 0)
      this.leftNav.isExpand = false
      this.leftNav.withoutAnimation = withoutAnimation
    },
    toggleDevice(device) {
      this.device = device
    },
    setSize(size) {
      this.size = size
      Cookies.set('size', size)
    },
    toggleSideBarHide(status) {
      this.leftNav.isHide = status
    }
  }
})

export default useAppStore
