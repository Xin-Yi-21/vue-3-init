export default {
  mounted(el, binding) {
    // 从参数中获取动画类名、刷新状态和节流延时
    const { class: animationClass = 'animated', isRefresh = true, timeout = 1000 } = binding.value || {};
    el.__animationClass = animationClass;

    // 初始化节流标志和延迟时间
    el.__throttleFlag = false; // 节流标志
    el.__throttleDelay = timeout; // 节流时间，单位 ms

    console.log('mounted: 初始化完成', { animationClass, isRefresh, timeout });
  },

  updated(el, binding) {
    // 从参数中获取动画类名、刷新状态和节流延时
    const { class: animationClass = 'animated', isRefresh = true, timeout = 1000 } = binding.value || {};

    // 动态更新节流时间
    el.__throttleDelay = timeout;

    // 如果 `isRefresh` 为 false，直接跳过更新逻辑
    if (!isRefresh) {
      console.log('updated: isRefresh 为 false，跳过动画逻辑');
      return;
    }

    // 如果处于节流期间，直接返回
    if (el.__throttleFlag) {
      console.log('updated: 节流中，跳过此次逻辑');
      return;
    }

    // 标志进入节流状态
    el.__throttleFlag = true;

    // 核心逻辑：强制触发动画重新执行
    el.classList.remove(el.__animationClass); // 移除旧动画类
    void el.offsetWidth; // 强制触发重绘
    el.classList.add(animationClass); // 添加新动画类

    console.log('updated: 执行动画更新逻辑', { animationClass, timeout });

    // 恢复节流标志
    setTimeout(() => {
      el.__throttleFlag = false;
      console.log('节流结束，可以再次执行逻辑');
    }, el.__throttleDelay);
  },

  unmounted(el) {
    // 清理动画类和自定义属性
    el.classList.remove(el.__animationClass);
    delete el.__animationClass;
    delete el.__throttleFlag;
    delete el.__throttleDelay;

    console.log('unmounted: 清理完成');
  },
};
