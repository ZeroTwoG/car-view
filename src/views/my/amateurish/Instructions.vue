<template>
  <div>
    <van-sticky>
      <van-nav-bar
          title="操作指南"
          left-arrow
          @click-left="onClickLeft"/>
    </van-sticky>
    <van-collapse v-model="activeNames" accordion>
      <van-collapse-item
          title="用户注册"
          name="1">
        <div>1、绑定微信后需要绑定手机号，手机号是本平台唯一识别用户的标识</div>
        <div>2、注册用户信息，填写车牌号、选择您要洗车的店铺，确认提交即可</div>
        <div>3、完成充值到您要洗车的门店就可以进店洗车了</div>
      </van-collapse-item>
      <van-collapse-item
          title="添加车辆"
          name="2">
        <van-image
            width="300"
            height="500"
            :src="image1"/>
        <van-image
            width="300"
            height="500"
            :src="image2"/>
      </van-collapse-item>
      <van-collapse-item
          title="充值缴费"
          name="3">
        <van-image
            width="300"
            height="500"
            :src="image3"/>
        <van-image
            width="300"
            height="500"
            :src="image4"/>
      </van-collapse-item>
      <van-collapse-item
          title="删除车辆"
          name="4">
        <van-image
            width="300"
            height="500"
            :src="image5"/>
        <van-image
            width="300"
            height="500"
            :src="image6"/>
      </van-collapse-item>
      <van-collapse-item
          title="联系店主"
          name="5">
        <van-image
            width="300"
            height="500"
            :src="image7"/>
        <div>如遇紧急情况联系不到店主，也可拨打打ETCC总部电话:4000-999-747</div>
      </van-collapse-item>
      <van-collapse-item
          title="退款流程"
          name="6">
        <div>如需退款可直接打电话联系店主，充值赠送的金额不退</div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>


<script>
export default {
  name: "Instructions",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      activeNames: ["1"],
      image1: require("../../../assets/img/wash/12.jpg"),
      image2: require("../../../assets/img/wash/13.jpg"),
      image3: require("../../../assets/img/wash/10.jpeg"),
      image4: require("../../../assets/img/wash/11.jpeg"),
      image5: require("../../../assets/img/wash/14.jpg"),
      image6: require("../../../assets/img/wash/15.jpg"),
      image7: require("../../../assets/img/wash/8.jpg"),
    };
  },
}
</script>
<style scoped>
.van-cell {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  overflow: hidden;
  color: #323233;
  font-size: 21px;
  line-height: 24px;
  text-align: left;
  background-color: #fff;
}

.van-collapse-item__content {
  padding: 12px 16px;
  color: #969799;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  background-color: #fff;
}
</style>