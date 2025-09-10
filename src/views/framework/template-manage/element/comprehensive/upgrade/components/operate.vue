<template>
  <el-dialog v-model="visible" class="c-dialog" :before-close="handleClose" width="1200" align-center draggable :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="c-d-header">
        <div class="h-t"><c-icon :i="dialog.icon" class="mr-5" size="18" cursor=""></c-icon> {{ dialog.title }}</div>
        <svg-icon icon-class="c-operate-close" class-name="n-o-i" @click="close"></svg-icon>
      </div>
    </template>
    <div class="c-d-c">
      <el-form :model="form" :rules="formRules" ref="formRef" class="c-form" label-position="right" label-width="100" style="--label-width:100px">
        <div class="c-row gap-10">
          <div class="c-column">
            <div class="c-efi">
              <div class="c-label">说明：</div>
              <div class="c-content">该模版包含 Element Plus 主流表单组件 及组件样式改，供参考使用。</div>
            </div>
          </div>
        </div>
        <div class="c-row">
          <!-- 普通输入框 -->
          <el-form-item label="姓名：" prop="personName">
            <el-input v-model="form.personName" placeholder="请输入姓名" disabled></el-input>
          </el-form-item>
        </div>
        <div class="c-row gap-10">
          <!-- 单选框 -->
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio v-for="(item, index) of enums.gender" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 数字框 -->
          <el-form-item label="年龄：" prop="age" :rules="[...formRules.age, { validator: numberVerifyNew({ decimalPlaces: 0, decimalPlacesMessage: '请输入整数' }), trigger: 'blur' }]">
            <el-input-number v-model="form.age" placeholder="请输入年龄" :controls="false"></el-input-number>
          </el-form-item>
          <!-- 复选框 -->
          <el-form-item label="兴趣：" prop="interest">
            <el-checkbox-group v-model="form.interest">
              <el-checkbox v-for="(item, index) of enums.interest" :key="index" :label="item.label" :value="item.value"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="c-row gap-10">
          <!-- 开关 -->
          <el-form-item label="主角" prop="main">
            <el-switch v-model="form.main" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ccc" />
          </el-form-item>
          <!-- 评分 -->
          <el-form-item label="人气魅力：" prop="popularity">
            <el-rate v-model="form.popularity" allow-half clearable :texts="['低', '中', '高', '很高', '极高']" show-text />
          </el-form-item>
          <!-- 滑块 -->
          <el-form-item label="智力武力：" prop="ability">
            <el-slider v-model="form.ability" />
          </el-form-item>
        </div>

        <div class="c-row gap-10">
          <!-- 单选下拉框 -->
          <el-form-item label="阵营：" prop="side">
            <el-select v-model="form.side" placeholder="请选择阵营" :popper-append-to-body="true">
              <el-option v-for="(item, index) in enums.side" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 多选下拉框 -->
          <el-form-item label="身份：" prop="identity">
            <el-select v-model="form.identity" multiple class="c-multiple-select" placeholder="请选择角色" :popper-append-to-body="true">
              <el-option v-for="(item, index) in enums.identity" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 时间选择 -->
        <div class="c-row">
          <!-- 日期选择器：年 -->
          <el-form-item label="登场年：" prop="appearanceYear">
            <el-date-picker v-model="form.appearanceYear" type="year" placeholder="请选择登场年" format="YYYY" value-format="YYYY"></el-date-picker>
          </el-form-item>
          <!-- 日期选择器：月 -->
          <el-form-item label="登场月：" prop="appearanceMonth">
            <el-date-picker v-model="form.appearanceMonth" type="month" placeholder="请选择登场月" format="YYYY-MM" value-format="YYYY-MM"></el-date-picker>
          </el-form-item>
          <!-- 日期选择器：日 -->
          <el-form-item label="登场日：" prop="appearanceDay">
            <el-date-picker v-model="form.appearanceDay" type="date" placeholder="请选择登场日" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
          <!-- 时间下拉框：时分 -->
          <el-form-item label="登场时分：" prop="appearanceTime">
            <el-time-select v-model="form.appearanceTime" start="00:00" end="23:59" step="00:01" placeholder="请选择登场时分" format="HH:mm" value-format="HH:mm:00"></el-time-select>
          </el-form-item>
        </div>
        <div class="c-row">
          <div class="c-column">
            <!-- 日期选择器：开始时间-结束时间 -->
            <div class="c-efi">
              <div class="c-label c-require">出现时间：</div>
              <div class="c-content gap-10">
                <el-form-item label="" prop="startTime">
                  <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
                </el-form-item>
                <span class="c-between-line">—</span>
                <el-form-item label="" prop="endTime">
                  <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="c-column">
            <!-- 时间选择器：开始时间-结束时间 -->
            <div class="c-efi">
              <div class="c-label c-require">工作时间：</div>
              <div class="c-content gap-10">
                <el-form-item label="" prop="workStartTime">
                  <el-time-picker v-model="form.activeStartTime" :default-value="new Date(0, 0, 0, 0, 0, 0)" placeholder="请选择活跃开始时间" format="HH:mm" value-format="HH:mm:00"></el-time-picker>
                </el-form-item>
                <span class="c-between-line">—</span>
                <el-form-item label="" prop="workEndTime">
                  <el-time-picker v-model="form.activeEndTime" :default-value="new Date(0, 0, 0, 0, 0, 0)" placeholder="请选择活跃结束时间" format="HH:mm" value-format="HH:mm:00"></el-time-picker>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div class="c-row">
          <!-- 文本域 -->
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }" resize="none"></el-input>
          </el-form-item>
        </div>

        <div class="c-row fdc table-part">
          <!-- 可编辑常规表格 -->
          <c-button type="primary" i="c-operate-add" height="30" @click="handleAddRelative">新增关系</c-button>
          <el-table :data="form.relationTable" class="c-table" border>
            <el-table-column label="" prop="" align="center" class-name="c-table-update-column">
              <template #header>人物</template>
              <template #default="scope">
                <el-form-item label="" :prop="`relationTable.${scope.$index}.person`" :rules="formRules.person">
                  <div class="c-normal-content">
                    <el-select v-model="scope.row.person" placeholder="请选择人物" clearable>
                      <el-option v-for="(item, index) in enums.person" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <template #error="{ error }">
                    <div class="c-error-content">
                      <el-tooltip :content="error" popper-class="c-error-tip" placement="top" :hide-after="1">
                        <el-select v-model="scope.row.person" placeholder="请选择人物" clearable>
                          <el-option v-for="(item, index) in enums.person" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-tooltip>
                    </div>
                  </template>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="" prop="" align="center" class-name="c-table-update-column">
              <template #header>关系</template>
              <template #default="scope">
                <el-form-item label="" :prop="`relationTable.${scope.$index}.relation`" :rules="formRules.relation">
                  <div class="c-normal-content">
                    <el-input v-model="scope.row.relation" placeholder="请输入关系"></el-input>
                  </div>
                  <template #error="{ error }">
                    <div class="c-error-content">
                      <el-tooltip :content="error" popper-class="c-error-tip" placement="top" :hide-after="1">
                        <el-input v-model="scope.row.relation" placeholder="请输入关系"></el-input>
                      </el-tooltip>
                    </div>
                  </template>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="" align="center" class-name="c-table-operate-column" width="70">
              <template #default="scope">
                <c-icon i="c-operate-delete" tip="删除" color="#FA4B4B" hoverColor="#FA4B4B" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleDeleteRelative(scope.$index)"></c-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="c-row fdc table-part">
          <!-- 可编辑单项表格 -->
          <c-tag type="primary" height="30" width="100">24小时得票</c-tag>
          <el-descriptions :column="9" class="c-desc-table" border direction="vertical">
            <el-descriptions-item :label="item.label" :width="item.width || 'auto'" align="center" v-for="(item, index) in form.hourTable" :key="index" class-name="c-table-update-column">
              <el-form-item v-if="item.type != 'th'" :prop="`hourTable.${index}.value`" :rules="[formRules.ratioValidate(item)]">
                <div class="c-normal-content">
                  <el-input-number v-model="item.value" :controls="false" :readonly="false"></el-input-number>
                </div>
                <template #error="{ error }">
                  <div class="c-error-content">
                    <el-tooltip :content="error" popper-class="c-error-tip" placement="top" :hide-after="1">
                      <el-input-number v-model="item.value" :controls="false" :readonly="false"></el-input-number>
                    </el-tooltip>
                  </div>
                </template>
              </el-form-item>
              <span v-else>{{ item.value }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="c-row">
          <!-- 三级联动下拉框 -->
          <div class="c-efi">
            <div class="c-label c-require">地区：</div>
            <div class="c-content gap-10">
              <el-form-item label="" prop="province">
                <el-select v-model="form.province" placeholder="请选择省" :popper-append-to-body="true">
                  <el-option v-for="(item, index) in enums.province" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="city">
                <el-select v-model="form.city" placeholder="请选择市" :popper-append-to-body="true">
                  <el-option v-for="(item, index) in enums.city" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="district">
                <el-select v-model="form.district" placeholder="请选择区/县" :popper-append-to-body="true">
                  <el-option v-for="(item, index) in enums.district" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="c-row">
          <div class="c-column">
            <!-- 树形下拉框 -->
            <el-form-item label="活跃地点" prop="activeLocation">
              <el-tree-select v-model="form.activeLocation" :data="enums.activeLocation"></el-tree-select>
            </el-form-item>
          </div>
          <div class="c-column">
            <!-- 级联框 -->
            <el-form-item label="活跃篇章" prop="activeArc">
              <el-cascader v-model="form.activeArc" :options="enums.activeArc" @change="" />
            </el-form-item>
          </div>
        </div>

        <div class="c-row">
          <!-- 穿梭框 -->
          <el-form-item label="活跃剧场" prop="aciveMovie">
            <el-transfer v-model="form.aciveMovie" :data="enums.aciveMovie" :props="{ key: 'value', label: 'label' }" :titles="['可选剧场', '出现剧场']" />
          </el-form-item>
        </div>
        <div class="c-row">
          <div class="c-efi">
            <div class="c-label c-require">富文本：</div>
            <div class="c-content"></div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="c-d-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="isConfirmLoading">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// # 一、综合
// 工具函数
import { numberVerifyNew } from '@/utils/verify'
// 接口
import { cPersonGet } from '@/api/framework/template-manage/element'
// 数据
import chinaData from '@/api/mock/china.json'
// props
const props = defineProps({
  operate: { type: String, default: 'add' },
  info: { type: Object, default: () => { } },
})
// pinia
import useStore from '@/store'

// 声明
const emit = defineEmits()
const { proxy } = getCurrentInstance()
const { enumsStore } = useStore()
const visible = ref(true)
const isConfirmLoading = ref(false)
// ^
// # 二、模块功能
// # 1、初始化
async function init() {
  await getEnums()
  setDefault()
}
// # (1) 获取枚举
const enums = ref({
  city: handleComputedCity()
})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newEnums = {
    // 性别
    gender: allEnums.gender,
    // 阵营
    side: [{ label: '红方', value: 'red' }, { label: '黑方', value: 'black' }, { label: '中立', value: 'gray' }],
    // 身份
    identity: [{ label: '侦探', value: '侦探' }, { label: '高中生', value: '高中生' }, { label: '小说家', value: '小说家' }, { label: '演员', value: '演员' }, { label: '警察', value: '警察' }, { label: '刑警', value: '刑警' }, { label: '律师', value: '律师' }, { label: '医生', value: '医生' }, { label: '科学家', value: '科学家' }, { label: '发明家', value: '发明家' }, { label: '小学生', value: '小学生' }, { label: '黑衣组织成员', value: '黑衣组织成员' }, { label: '记者', value: '记者' }, { label: '商人', value: '商人' }, { label: '艺人', value: '艺人' }, { label: '神秘人', value: '神秘人' },],
    // 兴趣
    interest: [{ label: '阅读', value: '阅读' }, { label: '音乐', value: '音乐' }, { label: '体育', value: '体育' }, { label: '美术', value: '美术' },],
    // 活跃地点
    activeLocation: [
      { label: '东京', value: 'tokyo', children: [{ label: '米花町', value: 'mihua', children: [{ label: '帝丹小学', value: 'teitan_primary' }, { label: '帝丹高中', value: 'teitan_high' }, { label: '米花百货大楼', value: 'mihua_mall' }] }, { label: '杯户区', value: 'beihu', children: [{ label: '杯户公园', value: 'beihu_park' }, { label: '杯户车站', value: 'beihu_station' }, { label: '杯户酒店', value: 'beihu_hotel' }] }, { label: '个人场所', value: 'personal', children: [{ label: '毛利侦探事务所', value: 'mouri_office' }, { label: '阿笠博士家', value: 'agasa_house' }, { label: '工藤新一家', value: 'kudo_house' }] }] },
      { label: '大阪', value: 'osaka', children: [{ label: '服部平次相关', value: 'heiji', children: [{ label: '服部家', value: 'heiji_house' }, { label: '关西警察厅', value: 'kansai_police' }] }, { label: '地标', value: 'osaka_landmarks', children: [{ label: '大阪城', value: 'osaka_castle' }, { label: '道顿堀', value: 'dotonbori' }] }] },
      { label: '海外', value: 'oversea', children: [{ label: '英国', value: 'uk', children: [{ label: '伦敦市区', value: 'london_city' }, { label: '伦敦大本钟', value: 'london_bigben' }] }, { label: '美国', value: 'usa', children: [{ label: '纽约', value: 'newyork' }, { label: '洛杉矶', value: 'losangeles' }] }] }
    ],
    // 活跃篇章
    activeArc: [
      { label: '主线篇章', value: 'main_story', children: [{ label: '工藤新一时代', value: 'shinichi', children: [{ label: '新一初登场案件', value: 'first_case' }, { label: '伦敦篇', value: 'london_arc' }] }, { label: '江户川柯南时代', value: 'conan', children: [{ label: '黑衣组织登场', value: 'black_org_intro' }, { label: '波本篇', value: 'bourbon_arc' }, { label: 'RUM篇', value: 'rum_arc' }] }] },
      { label: '角色篇章', value: 'character_arc', children: [{ label: '服部平次篇', value: 'heiji_arc', children: [{ label: '大阪案件', value: 'osaka_case' }, { label: '关西校园案件', value: 'kansai_school' }] }, { label: '怪盗基德篇', value: 'kaito_kid_arc', children: [{ label: '宝石盗窃篇', value: 'jewel_theft' }, { label: '魔术表演篇', value: 'magic_show' }] }] },
      { label: '特别篇章', value: 'special_arc', children: [{ label: 'OVA/特别篇', value: 'ova', children: [{ label: '消失的钻石', value: 'ova_diamond' }] }] }
    ],
    // 活跃剧场
    aciveMovie: [{ label: '计时引爆摩天楼 (1997)', value: 'movie_1997' }, { label: '第十四个目标 (1998)', value: 'movie_1998' }, { label: '世纪末的魔术师 (1999)', value: 'movie_1999' }, { label: '瞳孔中的暗杀者 (2000)', value: 'movie_2000' }, { label: '通往天国的倒计时 (2001)', value: 'movie_2001' }, { label: '贝克街的亡灵 (2002)', value: 'movie_2002' }, { label: '迷宫的十字路 (2003)', value: 'movie_2003' }, { label: '银翼的魔术师 (2004)', value: 'movie_2004' }, { label: '水平线上的阴谋 (2005)', value: 'movie_2005' }, { label: '侦探们的镇魂歌 (2006)', value: 'movie_2006' }, { label: '深蓝的灵柩 (2007)', value: 'movie_2007' }, { label: '战栗的乐谱 (2008)', value: 'movie_2008' }, { label: '漆黑的追踪者 (2009)', value: 'movie_2009' }, { label: '天空的遇难船 (2010)', value: 'movie_2010' }, { label: '沉默的15分钟 (2011)', value: 'movie_2011' }, { label: '第11个前锋 (2012)', value: 'movie_2012' }, { label: '绝海的侦探 (2013)', value: 'movie_2013' }, { label: '异次元的狙击手 (2014)', value: 'movie_2014' }, { label: '业火的向日葵 (2015)', value: 'movie_2015' }, { label: '纯黑的恶梦 (2016)', value: 'movie_2016' }, { label: '唐红的恋歌 (2017)', value: 'movie_2017' }, { label: '零的执行人 (2018)', value: 'movie_2018' }, { label: '绀青之拳 (2019)', value: 'movie_2019' }, { label: '绯色的子弹 (2021)', value: 'movie_2021' }, { label: '万圣节的新娘 (2022)', value: 'movie_2022' }, { label: '黑铁的鱼影 (2023)', value: 'movie_2023' }, { label: '百万美元的五稜星 (2024)', value: 'movie_2024' }, { label: '一闪之光的回忆 (2025)', value: 'movie_2025' }]
  }
  enums.value = Object.assign({}, enums.value, newEnums)
  await getPerson()
  await getPCD()
  getProvince()
}
// ^
// # -A- 获取人物 
async function getPerson() {
  let params = {
    currentPageNum: 1,
    currentPageSize: 999999,
  }
  const res = await cPersonGet(params)
  res.data?.list?.forEach(item => {
    item.label = item.personName
    item.value = item.personId
  })
  enums.value.person = res.data?.list || []
}
// ^
// # -B- 获取省市区
const pcdData = ref({})
function getPCD() {
  pcdData.value = chinaData
}
function getProvince() {
  console.log('查chinaData', chinaData)
  enums.value.province = chinaData.map(item => ({ label: item.name, value: item.code, }))
  enums.value.city = 计算属性写法
  enums.value.district = 计算属性写法
  console.log('查  enums.value.province', enums.value.province)
}

function handleComputedCity() {
  return computed(() => {
    console.log('查pcdData', pcdData)
    const newCityList = pcdData?.value?.find(p => p.code === form.value.province)?.children || []
    let res = newCityList?.map(item => ({ label: item.name, value: item.code })) || []
    console.log('查????????', res)
    return res
  })
}
// ^

// ^
// # (2) 设置默认
const form = ref({})
const formRules = ref({
  personName: [{ required: true, message: '姓名不能为空', trigger: 'blur' },],
  gender: [{ required: true, message: '性别不能为空', trigger: 'change' },],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' },],
  interest: [{ required: true, message: '兴趣不能为空', trigger: 'change' },],
  main: [{ required: true, message: '主角不能为空', trigger: 'change' },],
  ability: [{ required: true, message: '智力武力不能为空', trigger: 'change' },],
  popularity: [{ required: true, message: '人气魅力不能为空', trigger: 'change' },],
  side: [{ required: true, message: '阵营不能为空', trigger: 'change' },],
  identity: [{ required: true, message: '身份不能为空', trigger: 'change' },],
  appearanceYear: [{ required: true, message: '登场年不能为空', trigger: 'change' },],
  appearanceMonth: [{ required: true, message: '登场月不能为空', trigger: 'change' },],
  appearanceDay: [{ required: true, message: '登场日不能为空', trigger: 'change' },],
  appearanceTime: [{ required: true, message: '登场时分不能为空', trigger: 'change' },],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' },],
  endTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' },],
  workStartTime: [{ required: true, message: '工作开始时间不能为空', trigger: 'change' },],
  workEndTime: [{ required: true, message: '工作结束时间不能为空', trigger: 'change' },],
  person: [{ required: true, message: '人物不能为空', trigger: 'change' },],
  relation: [{ required: true, message: '关系不能为空', trigger: 'blur' },],
  ratioValidate: ratioValidate,
  province: [{ required: true, message: '省不能为空', trigger: 'change' },],
  city: [{ required: true, message: '市不能为空', trigger: 'change' },],
  district: [{ required: true, message: '区县不能为空', trigger: 'change' },],
  activeLocation: [{ required: true, message: '活跃地点不能为空', trigger: 'change' },],
  activeArc: [{ required: true, message: '活跃篇章不能为空', trigger: 'change' },],
  aciveMovie: [{ required: true, message: '活跃剧场不能为空', trigger: 'change' },],
  skill: [{ required: true, message: '技能不能为空', trigger: 'change' },],
})
function ratioValidate(rowData) {
  return {
    trigger: 'blur',
    validator: function (rule, value, callback) {
      // 1. 空值通过
      if (value === '' || value === null || value === undefined) {
        return callback()
      }
      // 2、数字
      const num = Number(value)
      if (!proxy.$hasValue(num)) {
        return callback(new Error('请输入数字'))
      }
      // 3、位数
      const decimalRegex = /^-?\d+(\.\d{1,3})?$/
      if (!decimalRegex.test(value)) {
        return callback(new Error('请输入最多三位小数的数字'))
      }
      // 4、下限
      if (num < 0) {
        return callback(new Error('请输入非负数'))
      }
      // 5、上限
      if (num > 100) {
        return callback(new Error('比例不能超过100%'))
      }
      // 6、全部通过
      callback()
    }
  }
}
const dialog = ref({})
function setDefault() {
  let newForm = {
    personId: props.info?.personId,
    personName: props.info?.personName,
    gender: props.info?.gender,
    age: props.info?.age,
    relationTable: [],
    hourTable: [],
  }
  switch (props.operate) {
    case 'add':
      Object.assign(form.value, newForm)
      dialog.value = { operate: 'add', title: '人物管理 - 新增', icon: 'c-operate-add' }
      break
    case 'view':
      Object.assign(form.value, newForm)
      dialog.value = { operate: 'view', title: '人物管理 - 查看', icon: 'c-operate-view' }
      break
    case 'update':
      Object.assign(form.value, newForm)
      dialog.value = { operate: 'update', title: '人物管理 - 更新', icon: 'c-operate-update' }
      break
  }
  getHourTable()
  function getHourTable() {
    let newTableData = []
    for (var i = 0; i < 24; i++) {
      let newItem = { label: i, value: null }
      newTableData.push(newItem)
    }
    let insertArr = [
      { label: '时刻点', value: '得票比(%)', insertIndex: 0, type: 'th', width: 90, },
      { label: '时刻点', value: '得票比(%)', insertIndex: 8, type: 'th', width: 90, },
      { label: '时刻点', value: '得票比(%)', insertIndex: 16, type: 'th', width: 90, },
    ]
    insertData(newTableData, insertArr)
    form.value.hourTable = newTableData || []
    // 插入函数
    function insertData(arr, insertArr) {
      const sorted = [...insertArr].sort((a, b) => b.insertIndex - a.insertIndex)
      sorted.forEach(obj => { arr.splice(obj.insertIndex, 0, obj) })
    }
  }
  // console.log('查form.value', toRaw(form.value))
}
// ^
// ^
// # 2、表格相关
// # (1) 新增关系
function handleAddRelative() {
  form.value.relationTable.push({ person: null, relative: null })
}
// ^
// # (2) 删除关系
function handleDeleteRelative(rowIndex) {
  form.value.relationTable.splice(rowIndex, 1)
}
// ^
// ^
// # 3、确认
function handleConfirm() {
  proxy.$refs.formRef.validate((valid) => {
    if (!valid) return false
    let params = {
      personName: form.value.personName,
      gender: form.value.gender,
      age: form.value.age,
      identity: form.value.identity,
    }
    switch (props.operate) {
      case 'add':
        xxxAdd(params).then(res => {
          proxy.$message.success('新增人物成功！')
          emit('refresh')
          emit('close')
        })
        break
      case 'update':
        params.personId = this.form.personId
        xxxUpdate(params).then(res => {
          this.$message.success('更新人物成功！')
          emit('refresh')
          emit('close')
        })
        break
    }
  })
}
// ^
// # 4、取消
function handleClose(done) {
  emit('close')
}
// ^
// ^
// # 三、生命周期
init()
// ^
</script>

<style lang="scss" scoped>
.c-dialog {
  .c-d-c {
    padding: 20px 20px 10px 10px;

    .table-part {
      .c-button {
        margin: 0 0 0 auto;
      }

      .c-tag {
        margin: 0 0 0 auto;
      }

      .c-table {
        margin: 5px 0 20px;
        width: 100%;
      }

      .c-desc-table {
        margin: 5px 0 20px;
        width: 100%;
      }
    }
  }


}
</style>
