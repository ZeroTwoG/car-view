<template>
  <div>
    <van-sticky>
      <van-nav-bar
          title="洗车教程"
          left-arrow
          @click-left="onClickLeft('/my')"/>
    </van-sticky>
    <van-swipe :autoplay="3000" width="100%" style="margin-top: 30px">
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" width="100%" height="100%"/>
      </van-swipe-item>
    </van-swipe>
    <div class="div" style="text-align: center;font-size: 35px">
      <van-icon name="clear" @click="close('my')"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true,
      images: [
        require("../../../assets/img/wash/1.jpg"),
        require("../../../assets/img/wash/2.jpg"),
        require("../../../assets/img/wash/3.jpg"),
        require("../../../assets/img/wash/4.jpg"),
        require("../../../assets/img/wash/5.jpg"),
        require("../../../assets/img/wash/6.jpg"),
        require("../../../assets/img/wash/7.jpg"),
        require("../../../assets/img/wash/8.jpg"),
        require("../../../assets/img/wash/9.jpg"),
      ]
    };
  },
  methods: {
    close(uri) {
      this.$router.push(uri, () => {
      }, () => {
      });
    },
    onClickLeft(uri) {
      this.$router.push(uri, () => {
      }, () => {
      });
    },
  },
}
</script>
<style scoped>


</style>