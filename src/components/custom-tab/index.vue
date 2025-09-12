<template>
  <div :class="['c-tab', cTabClass]" :style="`${height ? 'height:' + height + 'px' : ''}`">
    <div v-for="(item, index) in tabList" :key="index"
      :class="['tab-item', (modelValue === item.value || currentTab === item.value) ? 'is-active' : '', item.disabled ? 'is-disabled' : '']"
      :style="`${fontSize ? 'font-size:' + fontSize + 'px' : ''}`"
      @click="handleTabClick(item)">
      <c-icon :i="item.icon" class="tab-item-icon" v-if="item.icon"></c-icon>
      <span class="tab-item-text"> {{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabList: { type: Array, default: () => [] },
  currentTab: { type: [String, Number], default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: [String], default: 'normal' },
  height: { type: [String, Number], default: 36 },
  fontSize: { type: [String, Number], default: 14 }
})
const emit = defineEmits(['click', 'change', 'update:modelValue'])

const cTabClass = computed(() => {
  let newClassLRV = {
    'normal': 'c-tab-normal',
    'underline': 'c-tab-underline',
    'card': 'c-tab-card',
    'bg-card': 'c-bg-card'
  }
  return newClassLRV[props.type] || 'c-tab-normal'
})

function handleTabClick(tabItem) {
  if (!tabItem.disabled) {
    emit('click', tabItem)
    if (tabItem.value !== props.modelValue) {
      emit('update:modelValue', tabItem.value)
      emit('change', tabItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.c-tab.c-tab-normal {
  display: inline-flex;
  overflow: hidden;
  border-radius: 100px;
  font-size: var(--cfs);

  .tab-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 0 20px;
    border: 1px solid var(--bcs);
    border-right: 0;
    cursor: pointer;
    color: var(--fcs);

    &:first-child {
      border-radius: 100px 0 0 100px;
    }

    &:last-child {
      border-right: 1px solid var(--bcs);
      border-radius: 0 100px 100px 0;
    }

    &.is-active {
      background-color: var(--tc);
      border-color: var(--tc);
      color: #fff;
      font-weight: 700;

      &+div {
        border-left-color: var(--tc);
      }
    }

    &.is-disabled {
      cursor: not-allowed;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(0.5px);
      }
    }
  }
}

.c-tab.c-tab-underline {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--bcs);

  .tab-item {
    height: 100%;
    display: flex;
    align-items: center;
    color: var(--fcs);
    font-weight: 500;
    cursor: pointer;

    &:hover {
      color: var(--tc);
    }

    padding: 0 20px;

    // &:first-child {
    //   padding-right: 20px;
    // }

    // &:last-child {
    //   padding-left: 20px;
    // }

    // &:not(:first-child):not(:last-child) {
    //   padding: 0 20px;
    // }

    &.is-active {
      color: var(--tc);

      .tab-item-text {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: 100%;
        // box-shadow: inset 0 -2px 0 var(--tc);
        transition: all 0.3s ease;

        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 2px;
          background: var(--tc);
          z-index: 1;
        }
      }
    }
  }
}

.c-tab.c-tab-card {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--bcs);

  .tab-item {
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid var(--bcs);
    border-left: 1px solid var(--bcs);
    color: var(--fcs);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;

    &:first-child {
      border-left: 1px solid var(--bcs);
      border-top-left-radius: 4px;
    }

    &:last-child {
      border-right: 1px solid var(--bcs);
      border-top-right-radius: 4px;
    }

    &.is-active {
      color: var(--tc);
    }
  }
}

.c-tab.c-bg-card {
  width: 100%;
  display: flex;
  align-items: center;

  :root[theme-style='dark'] & {
    background-color: #f5f7fa;
  }

  :root[theme-style='dark'] & {
    background-color: #303030;
  }

  border-top: 1px solid var(--bcs);
  border-bottom: 1px solid var(--bcs);

  .tab-item {
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    color: var(--fcs);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;

    &.is-active {
      border-left: 1px solid var(--bcs);
      border-right: 1px solid var(--bcs);


      :root[theme-style='dark'] & {
        background-color: #fff;
      }

      :root[theme-style='dark'] & {
        background-color: #111;
      }

      color: var(--tc);
    }

    &:first-child {
      border-left: 1px solid transparent;
    }

  }
}
</style>
