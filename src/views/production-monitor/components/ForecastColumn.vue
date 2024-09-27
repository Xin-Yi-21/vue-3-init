<template>
  <div class="forecast-column-vue">
    <div class="forecast-model">
      <a-radio-group v-model:value="form.forecastModelType" @change="(e) => handleChangeForecastModel(e.target.value, 1)">
        <a-radio :value="item.value" v-for="(item, index) in enums.forecastModelType" :key="index">{{ item.label }}</a-radio>
      </a-radio-group>
    </div>
    <div class="part area-part" v-if="form.forecastModelType === 'REGION'">
      <div class="part-title"><svg-icon icon-class="part" class-name=""></svg-icon> 区域预报 </div>
      <div class="part-content">
      </div>
    </div>
    <div class="part single-part" v-if="form.forecastModelType === 'POINT'">
      <div class="part-title"><svg-icon icon-class="part" class-name=""></svg-icon> 单点预报 </div>
      <div class="part-content">
        <div class="c-row">
          <div class="c-label">选择站点</div>
          <a-select v-model:value="form.site" @change="handleChangeSearch">
            <a-select-option v-for="(item, index) in enums.site" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </div>
        <div class="radio-part">
          <div class="type-title">预报文件类型</div>
          <div class="type-content">
            <a-radio-group v-model:value="form.forecastFileType" @change="(e) => handleChangeSearch(e.target.value, 1)">
              <a-radio :value="item.value" v-for="(item, index) in enums.forecastFileType" :key="index">{{ item.label }}</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="radio-part" v-if="form.forecastFileType === 'QX'">
          <div class="type-title">预报气象类型</div>
          <div class="type-content">
            <a-radio-group v-model:value="form.forecastMeteorologyType" @change="(e) => handleChangeSearch(e.target.value, 1)">
              <a-radio :value="item.value" v-for="(item, index) in enums.forecastMeteorologyType" :key="index">{{ item.label }}</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="radio-part" v-if="form.forecastFileType === 'POWER'">
          <div class="type-title">预报出力类型</div>
          <div class="type-content">
            <a-radio-group v-model:value="form.forecastOutputType" @change="(e) => handleChangeSearch(e.target.value, 2)">
              <a-radio :value="item.value" v-for="(item, index) in enums.forecastOutputType" :key="index">{{ item.label }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="site-manage" @click="handleSiteManage">
      <svg-icon icon-class="site-manage" class-name=""></svg-icon><span>站点管理</span>
    </div>
  </div>
</template>

<script setup>
import useEnumsStore from '@/store/project/enums'
// 一、初始化相关
const enums = ref({})
const form = ref({})
const router = useRouter()
const emit = defineEmits(['getData', 'initDone'])
// 0、初始化总调用
function init() {
  getEnums()
  initForm()
}
init()
// 1、获取枚举
function getEnums() {
  enums.value = {
    site: useEnumsStore().allEnums.site,
    forecastModelType: useEnumsStore().allEnums.forecastModelType,
    forecastMeteorologyType: useEnumsStore().allEnums.forecastMeteorologyType,
    forecastFileType: useEnumsStore().allEnums.forecastFileType,
    forecastOutputType: useEnumsStore().allEnums.forecastOutputType,
  }
  form.value.forecastModelType = enums.value.forecastModelType[0].value
}
// 2、初始化表单
function initForm() {
  form.value.site = enums.value.site[0]?.value
  form.value.forecastFileType = enums.value.forecastFileType[0]?.value
  form.value.forecastMeteorologyType = enums.value.forecastMeteorologyType[0]?.value
  form.value.forecastOutputType = enums.value.forecastOutputType[0]?.value
  emit('initDone')
}
// 二、操作相关
// 1、改变模式
function handleChangeForecastModel() {
  // console.log('改变模式', form.value.forecastModelType)
  initForm()
  emit('getData', form.value)
}
// 2、改变要素
function handleChangeSearch() {
  // console.log('改变要素', form.value.forecastMeteorologyType)
  emit('getData', form.value)
}
// 5、站点管理
function handleSiteManage() {
  router.push('/site-manage')
}
defineExpose({ form })
</script>

<style scoped lang="scss">
.forecast-column-vue {
  width: 300px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .forecast-model {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .part {
    flex: 1;

    .part-title {
      height: 40px;
      display: flex;
      align-items: center;
      font-weight: 16px;
      font-weight: 700;
      background: #EEF9FF;

      .svg-icon {
        margin: 0 10px;
      }
    }

    .part-content {
      padding-top: 10px;

      .c-row {
        margin-bottom: 10px;
        padding: 0 10px;
        overflow: hidden;

        .c-label {
          width: 70px;
          text-align: left;
        }

        .ant-select {
          width: calc(100% - 70px)
        }
      }

      .radio-part {
        .type-title {
          display: flex;
          align-items: center;
          height: 30px;
          line-height: 30px;
          color: #666;
          font-size: 14px;
          background: #F5F6F9;
          border: 1px solid #D3D6D9;
          padding: 0 10px;

          &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 14px;
            background-color: #1375FC;
            margin-right: 7px;
          }
        }

        .type-content {
          padding: 10px;

          .ant-radio-group {
            width: 100%;

            .ant-radio-wrapper {
              // display: block;
              display: flex;
              align-items: center;
              padding: 0 10px 0 40px;
              margin-bottom: 10px;

              :deep(.ant-radio) {
                margin-right: 5px;
              }
            }
          }
        }

      }


    }

    // &.single-part {
    //   flex: 1;
    // }
  }

  .site-manage {
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E8F1FF;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #E8F1FF;
    font-size: 16px;
    font-weight: 700;
    color: #168CFF;
    cursor: pointer;

    .svg-icon {
      font-size: 18px;
      margin-right: 10px;
    }
  }
}
</style>