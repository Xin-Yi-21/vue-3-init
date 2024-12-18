<template>
  <div class="index-home-container">
    <div class="welcome">Welcome To New Project !</div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {

    }
  },
  methods: {
    handleGoMyNote() {

    },
  },
};
</script>

<style scoped lang="scss">
.index-home-container {
  width: 100%;
  height: 100%;
  // height: 1200px;
  background-image: url('~@/assets/images/bg-login.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  .welcome {
    position: absolute;
    top: 30vh;
    left: 50%;
    transform: translateX(-50%);
    height: 50px;
    color: #fff;
    font-size: 50px;
    font-weight: 700;
    text-align: center;
    z-index: 1;
  }

  .my-note {
    position: absolute;
    top: 36px;
    right: 36px;
    color: #fff;
    font-size: 20px;
    text-decoration: underline;
    text-underline-offset: 10px; // 设置下划线与文字的垂直距离
    text-decoration-thickness: 2px; // 设置下划线的粗细
    text-decoration-color: #fff; // 设置下换线颜色
    cursor: pointer;

    &:hover {
      scale: 1.1;
      color: #fff;
    }
  }
}
</style>
