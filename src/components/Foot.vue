<!-- <style>
.el-radio-button__inner {
  width: 100%;
  border: none !important;
  /* 使用 !important 可以确保这个样式优先级最高 */
}

.bottom-navbar {
  position: fixed;
  /* 固定在屏幕底部 */
  bottom: 0;
  left: 0;
  right: 0;
  /* 宽度占满整个屏幕 */
  display: flex;
  /* 使用Flexbox */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中（虽然在这个场景下可能不是必需的，但保持一致性）*/
  background-color: #fff;
  /* 背景色，根据需要调整 */
  padding: 10px 0;
  /* 上下内边距，根据需要调整 */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  /* 底部阴影，增加立体感 */
}

.el-radio-group {
  display: flex;
  /* 使按钮组内的按钮水平排列 */
  width: 100%;
  /* 宽度占满父容器 */
  justify-content: space-around;
  /* 平均分配空间，但会在按钮两侧留下额外空间 */
  /* 或者使用 justify-content: space-between; 如果不想在按钮两侧留空间 */
}

.el-radio-button {
  flex: 1;
  /* 使每个按钮平均分配空间 */
}
</style>
<template>
  <div class="bottom-navbar">
    <el-radio-group v-model="radio" @change="handleChange" border="false">
      <el-radio-button label="首页"><i class="el-icon-s-home"></i>首页</el-radio-button>
      <el-radio-button label="附近门店"><i class="el-icon-s-shop"></i>附近门店</el-radio-button>
      <el-radio-button label="商城"><i class="el-icon-s-goods"></i>商城</el-radio-button>
      <el-radio-button label="我的"><i class="el-icon-user-solid"></i>我的</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: ''
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);

      switch (value) {
        case '首页':
          this.$router.push("/index");
          break;
        case '附近门店':
          this.$router.push("/nearbyShop");
          break;
        case '商城':
          this.$router.push("/shopping");
          break;
        case '我的':
          this.$router.push("/myCenter");
          break;
        default:
          console.error('未知的值:', value);
      }
    }
  }
}
</script> -->