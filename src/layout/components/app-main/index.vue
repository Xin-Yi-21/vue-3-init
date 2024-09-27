<template>
  <!-- <section class="app-main-container">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section> -->
  <div class="app-main-vue"><router-view /></div>

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
