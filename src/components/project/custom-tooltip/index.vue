<template>
  <el-tooltip ref="tooltipRef" popper-class="c-tooltip" :effect="effect" :content="content" :placement="placement" :disabled="disabled" :open-delay="openDelay" :append-to-body="true">
    <slot></slot>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    effect: {
      type: String,
      default: 'dark'
    },
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    containerDomName: {
      type: String,
      default: '',
    },
    openDelay: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      disabled: true,
    }
  },
  mounted() {
    // this.$refs.here.appendChild(
    //   this.$refs.tooltipRef.popperVM.$el
    // )
  },
  watch: {
    content: {
      handler(newValue) {
        if (newValue) {
          this.judgeDisabled()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    judgeDisabled() {
      this.$nextTick(() => {
        let containerOffsetWidth = document.querySelector(this.containerDomName).offsetWidth
        let containerScrollWidth = document.querySelector(this.containerDomName).scrollWidth
        if (containerScrollWidth > containerOffsetWidth) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      })
    }
  },
}
</script>

<style lang="scss">
.c-tooltip {
  background: #f4f4f5 !important;
  border-radius: 2px;
  opacity: 1;
  border: 1px solid #333 !important;
  color: #333 !important;

  .popper__arrow {
    border-top-color: #333 !important;

    &::after {
      border-top-color: #f4f4f5 !important;
    }
  }
}
</style>