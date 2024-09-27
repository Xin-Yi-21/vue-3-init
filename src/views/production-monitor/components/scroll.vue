<template>
  <div class="scroll-container">
    <div class="scroll-content" :style="{ transform: `translateY(-${scrollY}px)` }">
      <div v-for="item in items" :key="item.id" class="scroll-item">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const items = ref([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' }
    ]);
    const scrollY = ref(0);
    const itemHeight = 50; // 每个项的高度
    const interval = 2000; // 滚动间隔时间

    const startScrolling = () => {
      setInterval(() => {
        scrollY.value += itemHeight;
        if (scrollY.value >= items.value.length * itemHeight) {
          scrollY.value = 0; // 重置
        }
      }, interval);
    };

    onMounted(startScrolling);

    return { items, scrollY };
  }
};
</script>

<style>
.scroll-container {
  height: 200px;
  /* 容器高度 */
  overflow: hidden;
  position: relative;
}

.scroll-content {
  transition: transform 0.5s ease;
}

.scroll-item {
  height: 50px;
  /* 每个项的高度 */
}
</style>