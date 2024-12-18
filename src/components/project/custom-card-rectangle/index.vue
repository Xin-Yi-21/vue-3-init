<template>
  <span class="c-card-rectangle" :style="`width:${width}px;height:${height}px;backgroundColor:${bg};`"></span>
</template>

<script>
// import variable from '@/assets/styles/variable.scss'
export default {
  props: {
    bg: {
      type: String,
      default: variable.tc,
    },
    width: {
      type: [String, Number],
      default: 5,
    },
    height: {
      type: [String, Number],
      default: 20,
    }
  },
  created() {
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
.c-card-rectangle {
  width: 5px;
  height: 20px;
  position: relative;
  display: inline-block;
  margin-right: 5px;
  background-color: var(--tc);
}
</style>