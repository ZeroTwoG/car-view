<template>
  <div>
    <div style="z-index: 1">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- 粘性布局 -->
        <van-sticky>
          <!-- 导航栏 -->
          <van-nav-bar title="更多" left-arrow @click-left="jump('/home')" />
        </van-sticky>
        <div>
        </div>
        <van-collapse v-model="activeNames">
          <van-collapse-item title="标题1" name="1">
            代码是写出来给人看的，附带能在机器上运行。
          </van-collapse-item>
          <van-collapse-item title="标题2" name="2">
            技术无非就是那些开发它的人的共同灵魂。
          </van-collapse-item>
          <van-collapse-item title="标题3" name="3">
            在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。
          </van-collapse-item>
        </van-collapse>
      </van-pull-refresh>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="chat" dot @click="jump('/msgHome')">客服</van-tabbar-item>
      <van-tabbar-item icon="shop" info="5" @click="jump('/storeMsg')">商家</van-tabbar-item>
      <van-tabbar-item icon="records">更多</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  comments: {
  },
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      active: 2,
    }
  },
  created() {
  },
  methods: {
    //跳转页面的方法
    jump(url) {
      this.$router.push({
        path: url,
        query: { myUrl: this.backUrl },
      })
    },
  }
}
</script>
<style scoped></style>