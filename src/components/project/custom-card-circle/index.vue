<template>
  <span class="c-card-circle out-circle" :style="`width:${outerSize}px;height:${outerSize}px;backgroundColor:${outerColor};`">
    <span class="inner-circle" :style="`width:${innerSize}px;height:${innerSize}px;backgroundColor:${innerColor};`"></span>
  </span>
</template>

<script>
export default {
  props: {
    outerColor: {
      type: String,
      default: '',
    },
    innerColor: {
      type: String,
      default: '',
    },
    outerSize: {
      type: [String, Number],
      default: 12,
    },
    innerSize: {
      type: [String, Number],
      default: 6,
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
.c-card-circle {
  width: 12px;
  height: 12px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  background-color: var(--tca2);
  margin-right: 5px;

  .inner-circle {
    width: 6px;
    height: 6px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    border-radius: 50%;
    background-color: var(--tc);
  }
}
</style>