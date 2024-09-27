<template>
  <!-- <section class="app-main-container">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section> -->
  <div class="app-main-container"><router-view /></div>

</template>

<script>
// export default {
//   name: 'AppMain',
//   computed: {
//     cachedViews() {
//       return this.$store.state.tagsView?.cachedViews || ''
//     },
//     key() {
//       return this.$route.path
//     }
//   }
// }
</script>

<style lang="scss" scoped>
.app-main-container {
  width: 100%;
  height: calc(100% - 110px);
  position: relative;
  overflow: hidden;
}
</style>
