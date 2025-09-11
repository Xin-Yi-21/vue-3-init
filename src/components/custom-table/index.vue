<template>
  <el-table class="c-table" v-bind="$attrs">
    <!-- <template #default v-if="slots.default">
    </template> -->
    <el-table-column label="字段1" prop="index" align="center" />
    <slot></slot>
  </el-table>
</template>

<script setup>
const props = defineProps({
  index: { type: Boolean, default: true, },
})
const slots = useSlots()
defineOptions({ inheritAttrs: false })
</script>

<style lang="scss" scoped></style>