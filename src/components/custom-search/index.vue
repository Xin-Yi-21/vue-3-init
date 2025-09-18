<template>
  <div :class="['c-search', Number(rows) > 1 && !isCollapse ? 'multiple-row' : 'single-row']" v-has="{ childClass: 'c-row', addClass: 'has-c-row', deep: true }" :style="`${height ? `--height:${$setCssSize(height)};` : ''} ${rows ? `--rows:${rows};` : 1}`">


    <div class="search-condition">
      <el-scrollbar v-wheel="{ target: '.el-scrollbar__wrap' }">
        <slot name="searchCondition"></slot>
      </el-scrollbar>
    </div>


    <div class="search-operate">
      <c-icon i="c-arrow-down-double" :tip="isCollapse ? '展开' : '收起'" :class="isCollapse ? 'is-collapse' : 'is-expand'" :color="settingStore?.theme?.customCssV?.fcs" :hoverColor="settingStore.themeColor" cursor="pointer" v-if="(rows && rows != 1)" @click="isCollapse = !isCollapse"></c-icon>
      <template v-if="useDSO">
        <c-button type="primary" class="query-button" i="c-operate-search" @click="emit('search')">查询</c-button>
        <c-button type="info" class="refresh-button" i="c-operate-refresh" @click="emit('refresh')"></c-button>
      </template>
      <slot name="searchOperate"></slot>
    </div>
    <div class="extend-operate">
      <slot name="extendOperate"></slot>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
// props
const props = defineProps({
  height: { type: [Number, String], default: 60 },
  rows: { type: [Number, String], default: 2 },              // 行数。单行展示内容超出横向滚动。多行展示内容超出竖向滚动。
  useDSO: { type: [Boolean], default: true },                // 使用默认查询操作
})
// pinia
import useStore from '@/store'
// 声明
const emit = defineEmits()
const { settingStore } = useStore()
// 计算属性
// ^

// # 二、模块功能
// # 1、初始化
const isCollapse = ref(true)
function init() {

}
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
// ^
</script>

<style lang="scss" scoped>
.c-search {
  width: calc(100% - 20px);
  display: flex;
  margin: 10px;
  padding: 0 10px;
  background-color: var(--bg-card);
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;

  :deep(.search-condition) {
    height: 100%;
    overflow: hidden;

    .el-form {
      height: 100%;
      display: inline-flex;
      padding-top: calc(calc(var(--height)/2) - calc(var(--ch)/2));
      margin-bottom: 0;
      align-content: flex-start;
      gap: 0 20px;
      margin-right: 10px;

      .c-row {
        width: auto;
        max-width: 100%;
        // overflow-x: auto;
        flex-wrap: nowrap;
        align-items: start;
        gap: 0 20px;
      }

      .el-form-item {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin: 0 0 0 0;
        width: 250px;
        margin-bottom: calc(calc(var(--height)/2) - calc(var(--ch)/2));
        height: auto;

        .el-form-item__label {
          flex-shrink: 0;
          padding-right: 10px;
        }

        .el-form-item__content {
          flex-grow: 1;

          flex-shrink: 0;

          .el-input {
            width: 100%;
          }

          .el-select {
            width: 100%;
          }
        }
      }
    }
  }

  :deep(.search-operate) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 10px;
    width: 180px;
    height: var(--height);


    .c-icon {
      margin: 0;

      .svg-icon {
        transition: transform 0.5s ease;
      }

      &.is-expand {
        .svg-icon {
          transform: rotate(-180deg);
        }
      }
    }

    .c-button {
      margin: 0;
    }
  }

  :deep(.extend-operate) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: var(--height);
    margin-left: auto;
  }

  &.single-row {
    height: var(--height);

    :deep(.search-condition) {
      overflow-x: auto;

      .el-form {
        flex-wrap: nowrap;
      }
    }
  }

  &.multiple-row {
    height: calc(((var(--rows) + 1) / 2) * var(--height) + ((var(--rows) - 1) / 2) * var(--ch));


    :deep(.search-condition) {
      .el-form {
        flex-wrap: wrap;
        align-content: flex-start;
      }
    }

    &.has-c-row {
      :deep(.search-condition) {
        .el-form {
          display: block;
        }
      }
    }
  }

}
</style>