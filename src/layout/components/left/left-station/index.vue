<template>
  <div :class="['left-station-vue', isVerticalCollapse ? 'is-vertical-collapse' : 'is-vertical-expand', isHorizontalCollapse ? 'is-horizontal-collapse' : 'is-horizontal-expand',]">
    <div :class="['select-station-part',]">
      <div class="part-header" @click="handleVerticalToggle">
        <c-icon i="c-show-station" size="16" class="station-icon"></c-icon>
        <span class="part-header-title">场站选择</span>
        <c-icon i="c-arrow-down-thin" size="18" :class="['toggle-icon', isVerticalCollapse ? 'is-rotate' : '']" cursor="pointer"></c-icon>
      </div>
      <c-tab height="30" fontSize="12" :tabList="tabList" :currentTab="currentTab" @change="handleChangeTab"></c-tab>
      <el-input v-model="stationName" class="search-input" placeholder="请输入场站名称" @input="handleSearchStation"></el-input>
      <div class="station-list-vue" v-if="currentTab === 'list'" ref="lnsRef">
        <el-scrollbar>
          <el-tree ref="treeRef" node-key="treeId" :indent="0" :data="listData" :props="{ ...defaultProps, class: (item) => { return item.isDisabled ? 'disabled-station' : '' } }" default-expand-all @node-click="handleNodeClick" highlight-current :filter-node-method="handleFilterNode">
            <template #default="{ node, data }">
              <div :class="['tree-row']" :style="getNodeStyle(node)">
                <c-icon i="c-show-circle" size="18" v-if="!data.stationType"></c-icon>
                <c-icon i="c-show-station-solar" size="16" v-if="data.stationType?.includes('光伏')"></c-icon>
                <c-icon i="c-show-station-wind" size="16" v-if="data.stationType?.includes('风电')"></c-icon>
                <c-icon i="c-show-station-fire" size="16" v-if="data.stationType?.includes('火电')"></c-icon>
                <c-icon i="c-show-station-storage" size="16" v-if="data.stationType?.includes('储能')"></c-icon>
                <c-icon i="c-show-station-nuclear" size="16" v-if="data.stationType?.includes('核电')"></c-icon>
                <span>{{ data.treeName }}</span>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div :class="['station-tree-vue',]" v-if="currentTab === 'tree'" ref="lnsRef">
        <el-scrollbar>
          <el-tree ref="treeRef" node-key="treeId" :indent="0" :data="treeData" :props="{ ...defaultProps, class: (item) => { return item.isDisabled ? 'disabled-station' : '' } }" default-expand-all @node-click="handleNodeClick" highlight-current :filter-node-method="handleFilterNode">
            <template #default="{ node, data }">
              <div :class="['tree-row']" :style="getNodeStyle(node)">
                <c-icon i="c-show-circle" size="18" v-if="!data.stationType"></c-icon>
                <c-icon i="c-show-station-solar" size="16" v-if="data.stationType?.includes('光伏')" class=""></c-icon>
                <c-icon i="c-show-station-wind" size="16" v-if="data.stationType?.includes('风电')"></c-icon>
                <c-icon i="c-show-station-fire" size="16" v-if="data.stationType?.includes('火电')"></c-icon>
                <c-icon i="c-show-station-storage" size="16" v-if="data.stationType?.includes('储能')"></c-icon>
                <c-icon i="c-show-station-nuclear" size="16" v-if="data.stationType?.includes('核电')"></c-icon>
                <span>{{ data.treeName }}</span>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="current-station-part">
      <div class="left">
        <span class="left-label">当前场站</span>
        <img v-if="stationStore?.currentStation?.stationType?.includes('光伏')" src="@/assets/images/c-show-station-solar.png" alt="光伏场站">
        <img v-if="stationStore?.currentStation?.stationType?.includes('风电')" src="@/assets/images/c-show-station-wind.png" alt="风电场站">
        <img v-if="stationStore?.currentStation?.stationType?.includes('火电')" src="@/assets/images/c-show-station-fire.png" alt="火电场站">
        <img v-if="stationStore?.currentStation?.stationType?.includes('储能')" src="@/assets/images/c-show-station-storage.png" alt="储能场站">
        <img v-if="stationStore?.currentStation?.stationType?.includes('核电')" src="@/assets/images/c-show-station-nuclear.png" alt="核电场站">
      </div>
      <div class="right">
        <span class="station-name">
          <c-tooltip :content="stationStore?.currentStation?.treeName" targetClass="overflow-test" placement="top" effect="light" maxWidth="400">
            <c-scroll direction="x" scrollType="smooth" :stepTime="1000" :stayTime="0" :scrollBar="false">
              <span class="overflow-test">{{ stationStore?.currentStation?.stationName }} </span>
            </c-scroll>
          </c-tooltip>
        </span>
        <span class="station-company">
          <c-tooltip :content="stationStore?.currentStation?.treeName" targetClass="overflow-test" placement="top" effect="light" maxWidth="400">
            <c-scroll direction="x" scrollType="smooth" :stepTime="1000" :stayTime="0" :scrollBar="false">
              <span class="overflow-test">{{ stationStore?.currentStation?.deptName }} </span>
            </c-scroll>
          </c-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
// pinia
import useStore from '@/store'
// hook
import { useResizeObserver } from '@/hooks/resizeObserver'
// 声明
const { proxy } = getCurrentInstance()
const route = useRoute()
const { stationStore, settingStore, enumsStore } = useStore()
// ^

// # 二、模块功能
// # 1、初始化
function init() {
  getStation()
  setBus()
}
// # (1) 设置广播监听
function setBus() {
  proxy.$bus.on('refreshCurrentStation', (newCurrentStationId) => {
    currentStationId.value = newCurrentStationId
    currentStation.value = enumsStore.allEnums.stationList?.find(item => { return item.stationId === newCurrentStationId })
    stationStore.setCurrentStation(toRaw(currentStation.value))
    settingStore.setTitle(route.meta.title)
    treeRef.value?.setCurrentKey(currentStationId.value)
  })
}
// ^
// ^

// # 2、获取站点树
const defaultProps = ref({ children: 'children', label: 'treeName', value: 'treeId' })
const treeRef = ref(null)
const treeData = ref([])
const listData = ref([])
const currentStation = ref({})
const currentStationId = ref('')
async function getStation() {
  let params = { stationName: stationName.value || '' }
  treeData.value = enumsStore.allEnums.stationTree
  listData.value = enumsStore.allEnums.stationList
  function getFirstStation(tree) {
    // 遍历整个树结构
    for (let node of tree) {
      // 如果节点有 children，递归获取
      if (node.children) {
        const firstStation = getFirstStation(node.children);
        if (firstStation) {
          return firstStation;
        }
      }
      // 如果节点是场站，返回第一个场站
      if (node.stationName) {
        return node;
      }
    }
    return null;
  }
  currentStation.value = getFirstStation(treeData.value)
  currentStationId.value = currentStation.value.stationId
  currentStation.value.changeBy = 'node'
  stationStore.setCurrentStation(toRaw(currentStation.value))
  settingStore.setTitle(route.meta.title)
  treeRef.value?.setCurrentKey(currentStationId.value)
}
// ^
// # 3、搜索场站
const stationName = ref('')
function handleSearchStation() {
  proxy.$debounce(e => {
    treeRef.value.filter(stationName.value)
  }, 1500)()
}
function handleFilterNode(value, data) {
  if (!value) return true
  return data.treeName.includes(value)
}
// ^
// # 4、鼠标左击节点
function handleNodeClick(data) {
  if (data.stationId) {
    data.changeBy = 'node'
    stationStore.setCurrentStation(toRaw(data))
    settingStore.setTitle(route.meta.title)
    // tagStore.updateTag(route, { station: stationStore.currentStation, })
    currentStation.value = data
    currentStationId.value = data.stationId
  }
}
// ^
// # 5、场站折叠展开
// # (1) 横向折叠展开
const isHorizontalCollapse = computed(() => settingStore.leftSide.isCollapse)
// ^
// # (2) 竖向折叠展开
const isVerticalCollapse = ref(false)
function handleVerticalToggle() {
  isVerticalCollapse.value = !isVerticalCollapse.value
}
// ^
// ^
// # 6、根据 node.level 设置不同的 padding-left
function getNodeStyle(node) {
  return {
    paddingLeft: `${node.level * 15}px`, // 每一层递增 15px
  }
}
// ^
// # 7、切换tab
const tabList = ref([{ label: '列表视图', value: 'list' }, { label: '树状视图', value: 'tree' }])
const currentTab = ref('list')
function handleChangeTab(newCurrentTab) {
  currentTab.value = newCurrentTab.value
  nextTick(() => {
    treeRef.value?.setCurrentKey(currentStationId.value)
    treeRef.value.filter(stationName.value)
  })
}
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
onUnmounted(() => {
  proxy.$bus.off('refreshCurrentStation')
})
defineExpose({ isVerticalCollapse })
// ^
</script>

<style lang="scss" scoped>
.left-station-vue {
  width: calc(100% - 20px);
  flex: 1;
  margin: 0 10px 10px;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16);
  border-radius: 2px;

  :root[theme-style='dark'] & {
    background-color: var(--bg-card);
  }

  :root[theme-style='light'] & {
    background-color: var(--bg-card);
  }

  &.is-vertical-collapse {
    flex: initial;
    height: 40px;
  }

  &.is-horizontal-collapse {
    display: none;
  }

  .select-station-part {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .part-header {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    overflow: hidden;
    height: 40px;
    padding: 0 10px;
    color: var(--tc);
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;

    .c-icon {
      color: var(--tc);
      font-size: 14px;
      margin: 0;
    }

    .station-icon {
      margin-right: 10px;
    }

    .toggle-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      transition: transform 0.5s ease;

      &.is-rotate {
        transform: translateY(-50%) rotate(-180deg);
      }
    }
  }

  :deep(.c-tab) {
    width: calc(100% - 20px);
    margin: 5px 10px 10px;
  }

  .search-input {
    width: calc(100% - 20px);
    height: 30px;
    margin: 0 10px 10px;
  }


  .station-tree-vue,
  .station-list-vue {
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-shrink: 0;
    overflow: hidden;
    width: calc(100% - 16px);
    margin: 0 8px 8px;
    border-radius: 2px;

    :deep(.el-tree) {
      flex: 1;
      flex-shrink: 0;
      overflow-y: auto;
      padding-left: 0;
      background-color: transparent;

      .el-tree-node {
        &.disabled-station {
          pointer-events: none;
          opacity: 0.6;
        }
      }

      .el-tree-node__content {
        position: relative;
        height: 36px;
        margin-bottom: 2px;

        &:hover {
          background-color: var(--bg-hover);
        }

        .el-icon {
          position: absolute;
          right: 15px;

          svg {
            display: none;
          }

          &::before {
            content: '\e671';
            font-family: 'iconfont';
            font-size: 16px;
            font-style: normal;
          }
        }

        .tree-row {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          color: var(--fct);

          .circle {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }

          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 10px;
            font-size: 14px;
          }

        }
      }

      .el-tree-node {
        &.is-current {
          &>.el-tree-node__content {
            background-color: var(--tc-alpha-5);

            &::before {
              content: "";
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 4px;
              height: 100%;
              border-radius: 1px;
              background-color: var(--tc);
            }

            .tree-row {
              color: var(--tc);
              font-weight: 400;
            }
          }
        }

        // 忽略兼容必要性
        &:has(.is-current) {
          &>.el-tree-node__content {
            .tree-row {
              color: var(--tc);
              font-weight: 400;
            }
          }
        }
      }
    }
  }

  .current-station-part {
    position: absolute;
    bottom: 10px;
    display: flex;
    overflow: hidden;
    width: calc(100% - 16px);
    height: 90px;
    margin-top: 10px;
    border-radius: 3px;
    background-color: var(--tc-alpha-5);

    .left {
      width: 110px;

      .left-label {
        display: inline-block;
        font-size: 10px;
        color: var(--fct);
        padding-left: 10px;
        // padding-top: 10px;
        line-height: 14px;
      }

      img {
        width: 80px;
        margin: 0 10px 0 20px;
        height: 70px;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }

    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: flex-end;
      text-align: right;
      overflow: hidden;
      // background-color: red;

      .station-name {
        width: 100%;
        margin-bottom: 5px;
        padding-right: 15px;
        color: var(--tc);
        font-size: 14px;
      }

      .station-company {
        width: 100%;
        font-size: 10px;
        margin-bottom: 5px;
        padding-right: 15px;
        color: var(--fct);
      }
    }
  }
}
</style>