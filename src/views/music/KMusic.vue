<template>
  <div>
    <div style="z-index: 1">
      <!--      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
      <!-- 粘性布局 -->
      <van-sticky>
        <!-- 导航栏 -->
        <van-nav-bar title="音乐K" left-arrow @click-left="jump('/home')" />
      </van-sticky>
      <div>
      </div>
      <!--      </van-pull-refresh>-->
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" dot @click="jump('/music')">主页</van-tabbar-item>
      <van-tabbar-item icon="play" dot>K</van-tabbar-item>
      <van-tabbar-item icon="more-o" info="5" @click="jump('/kmusic')">动态</van-tabbar-item>
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
      active: 1,
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