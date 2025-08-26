import { watch, onActivated, onDeactivated } from 'vue';

/**
 * useActiveWatch
 * 
 * 在 keep-alive 包裹的组件中，
 * 仅当组件激活（activated）时，才注册 watch，
 * 失活（deactivated）时自动停止 watch。
 *
 * @param {import('vue').WatchSource} source - 要监听的响应式数据或 getter。可为单个或数组。
 * @param {Function} callback - 监听回调 (newVal, oldVal) => void。
 * @param {import('vue').WatchOptions} [options] - 与 Vue 原生 watch 接口一致的配置项。
 * @returns void
 */
export function useActiveWatch(source, callback, options = {}) {
  // let stopHandle = null;

  // // 组件被 keep-alive 激活时
  // onActivated(() => {
  //   // 如果已有 watcher，则先停止
  //   if (stopHandle) {
  //     stopHandle();
  //   }
  //   // 注册新的 watcher
  //   stopHandle = watch(source, callback, options);
  // });

  // // 组件被 keep-alive 失活时
  // onDeactivated(() => {
  //   if (stopHandle) {
  //     stopHandle();
  //     stopHandle = null;
  //   }
  // });

  watch(source, callback, options)
}




