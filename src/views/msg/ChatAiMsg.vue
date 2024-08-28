<template>
<div>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="chat" dot @click="jump('/msgHome')">客服</van-tabbar-item>
    <van-tabbar-item icon="shop" info="5" @click="jump('/storeMsg')">商家</van-tabbar-item>
    <van-tabbar-item icon="records"  @click="jump('/textMsg')">更多</van-tabbar-item>
  </van-tabbar>
</div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

export default {
  comments:{
  },
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      active: 0,
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
<style scoped>

</style>