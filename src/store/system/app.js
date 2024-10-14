import Cookies from 'js-cookie'

const useAppStore = defineStore('app', {
  state: () => ({
    leftNav: {
      // isCollapse: Cookies.get('leftNavStatus') ? !!+Cookies.get('leftNavStatus') : false,
      isCollapse: false,
      withoutAnimation: false,
      isHide: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'default'
  }),
  actions: {
    toggleLeftNav(withoutAnimation) {
      if (this.leftNav.isHide) { return false }
      this.leftNav.isCollapse = !this.leftNav.isCollapse
      this.leftNav.withoutAnimation = withoutAnimation
      Cookies.set('leftNavStatus', this.leftNav.isCollapse ? true : false)
    },
    closeLeftNav({ withoutAnimation }) {
      Cookies.set('leftNavStatus', 0)
      this.leftNav.isCollapse = false
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
