<template>
  <div>
    <div style="z-index: 1">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- 粘性布局 -->
        <van-sticky>
          <!-- 导航栏 -->
          <van-nav-bar title="商家" left-arrow @click-left="jump('/home')" />
        </van-sticky>
        <div>
        </div>
        <van-row>
          <van-cell-group>
            <van-cell title="单元格" value="内容" />
            <van-cell title="单元格" value="内容" label="描述信息" />
          </van-cell-group>
        </van-row>
      </van-pull-refresh>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="chat" dot @click="jump('/msgHome')">客服</van-tabbar-item>
      <van-tabbar-item icon="shop" info="5">商家</van-tabbar-item>
      <!--    <van-tabbar-item icon="records"  @click="jump('/textMsg')">更多</van-tabbar-item>-->
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