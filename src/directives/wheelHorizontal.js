// export default {
//   mounted(el) {
//     // 滚轮事件处理
//     const handler = (e) => {
//       if (e.deltaY !== 0) {
//         e.preventDefault()
//         el.scrollLeft += e.deltaY
//       }
//     }

//     // 保存引用，方便解绑
//     el._wheelHandler = handler

//     // 添加监听
//     el.addEventListener('wheel', handler, { passive: false })
//   },
//   unmounted(el) {
//     el.removeEventListener('wheel', el._wheelHandler)
//     delete el._wheelHandler
//   }
// }

export default {
  mounted(el, binding) {
    const options = binding.value || {};
    const selector = options.target;
    const speed = typeof options.speed === 'number' ? options.speed : 1;

    const target = selector ? el.querySelector(selector) : el;
    if (!target) return;

    const handler = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        target.scrollLeft += e.deltaY * speed;
      }
    };

    target._wheelHHandler = handler;
    target.addEventListener('wheel', handler, { passive: false });
  },

  unmounted(el, binding) {
    const selector = binding.value?.target;
    const target = selector ? el.querySelector(selector) : el;

    if (target && target._wheelHHandler) {
      target.removeEventListener('wheel', target._wheelHHandler);
      delete target._wheelHHandler;
    }
  }
};