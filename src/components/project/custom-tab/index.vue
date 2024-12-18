<template>
  <div class="c-tab">
    <div :class="['tab-item', currentTab == item.value ? 'is-active' : '']" v-for="(item, index) in tabList" :key="index" @click="handleChangeTab(item)">{{ item.label }}</div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    tabList: {
      type: Array,
      default: () => []
    },
    currentTab: {
      type: String,
      default: ''
    },
  },
  data() {
    return {

    }
  },

  methods: {
    handleChangeTab(tabItem) {
      this.$emit('change', tabItem)
    }
  },
}
</script>

<style lang="scss" scoped>
.c-tab {
  width: auto;
  height: 100%;
  display: inline-flex;
  height: 36px;
  border-radius: 18px;
  overflow: hidden;

  .tab-item {
    min-width: 120px;
    height: 100%;
    text-align: center;
    line-height: 36px;
    border: 1px solid var(--bcs);
    border-right: 0;
    cursor: pointer;
    color: var(--fcp);
    padding: 0 20px;

    &:first-child {
      // border: 1px solid #ccc;
      border-top-left-radius: 18px;
      border-bottom-left-radius: 18px;
    }

    &:last-child {
      border-right: 1px solid var(--bcs);
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
    }

    &.is-active {
      background-color: var(--tc);
      color: #fff;
      font-weight: 700;
      border-color: var(--tc);

      &+div {
        border-left-color: var(--tc);
      }
    }
  }

}
</style>