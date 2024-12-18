<template>
  <div class="c-card-title">
    <c-card-circle v-if="icon === 'circle'"></c-card-circle>
    <c-card-rectangle v-else-if="icon === 'rectangle'"></c-card-rectangle>
    <svg-icon v-else-if="icon" :icon-class="icon" class-name="card-title-icon"></svg-icon>
    <span class="card-title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {

    }
  },

  methods: {

  },
}
</script>

<style lang="scss" scoped>
.c-card-title {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0;
  overflow: hidden;

  .card-title-icon-svg {
    font-size: 18px;
    flex-shrink: 0;
  }

  .card-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 700;
    font-size: 16px;
    color: var(--fcp);
    white-space: nowrap;
  }
}
</style>