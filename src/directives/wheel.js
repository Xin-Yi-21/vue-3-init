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
    const selector = options.target; // 传入选择器
    const speed = typeof options.speed === 'number' ? options.speed : 1;

    const target = selector ? el.querySelector(selector) : el;
    if (!target) return;

    const handler = (e) => {
      const canScrollY = target.scrollHeight > target.clientHeight;
      const canScrollX = target.scrollWidth > target.clientWidth;

      // 横纵都有 → 交给浏览器默认
      if (canScrollX && canScrollY) return;

      // 只有横向 → 用纵向滚轮控制横向
      if (canScrollX && !canScrollY && e.deltaY !== 0) {
        e.preventDefault();
        target.scrollLeft += e.deltaY * speed;
      }

      // 只有纵向 → 交给浏览器默认
    };

    target._smartScrollHandler = handler;
    target.addEventListener("wheel", handler, { passive: false });
  },

  unmounted(el, binding) {
    const selector = binding.value?.target;
    const target = selector ? el.querySelector(selector) : el;

    if (target && target._smartScrollHandler) {
      target.removeEventListener("wheel", target._smartScrollHandler);
      delete target._smartScrollHandler;
    }
  },
};
