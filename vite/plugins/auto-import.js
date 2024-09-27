import autoImport from 'unplugin-auto-import/vite'
export default function createAutoImport() {
  return autoImport({
    imports: [
      // 省略vue提供的compositionAPI函数： import { ref, reactive, computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
      'vue',
      // 省略vue-router提供的函数： import { useRouter, userRoute } from 'vue-router'
      'vue-router',
      // 省略pinia提供的函数：import { defineStore} from 'pinia' 
      'pinia'
    ],
    dts: false
  })
}
