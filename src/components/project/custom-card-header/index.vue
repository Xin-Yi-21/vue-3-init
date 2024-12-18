<template>
  <div class="c-card-header" :style="border ? `borderBottom:1px solid var(--bcp);` : ''">
    <div class="left">
      <c-card-title v-if="title" :title="title" :icon="icon"></c-card-title>
      <slot name="left"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
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
    border: {
      type: Boolean,
      default: true
    }
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
.c-card-header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0;
  overflow: hidden;

  .left {
    margin-right: auto;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .right {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>