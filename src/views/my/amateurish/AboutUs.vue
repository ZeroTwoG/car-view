<template>
  <div id="aboutUs">
    <!-- 头部刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 粘性布局 -->
      <van-sticky>
        <!-- 导航栏 -->
        <van-nav-bar title="关于我们" left-arrow @click-left="onClickLeft" />
        <!-- 标题 -->
      </van-sticky>
      <van-image style="font-size: 16px;margin-top: 30px;margin-left: 22%" width="200" height="100"
        :src="require('@/assets/img/carLogo/洗车标识.png')" />
      <van-row style="font-size: 16px;margin-top: 30px;margin-left: 38%">当前版本{{ aboutUsData.editionNo }}
      </van-row>
      <div v-html="aboutUsData.about"></div>
    </van-pull-refresh>
  </div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

export default {
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },

  data() {
    return {
      isLoading: false, //刷新参数
      aboutUsData: [],
    }
  },
  created() {
    this.selectAboutUs();
  },
  methods: {
    //刷新方法
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        //调用请求
      }, 1000);
    },
    //获取关于我们最新数据
    selectAboutUs() {
      axios.post("/my/about/selectFirst").then(resp => {
        this.aboutUsData = resp.data.data;
      }).catch(function (error) {
        console.log(error);
      });
    }

  }
}
</script>