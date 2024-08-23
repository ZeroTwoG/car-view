<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="充值" left-arrow @click-left="jump('/balance')" />
    <!-- 选择门店 -->
    <van-row class="container">
      <van-col span="5" style="font-size: 15px; font-weight: bold">门店名称</van-col>
      <van-col span="12"></van-col>
      <van-col span="7" @click="jump('/payChooseStore')" style="font-size: 15px;">{{ storeName }}
        <van-icon name="arrow" />
      </van-col>
    </van-row>
    <!-- 背景条 -->
    <van-row style="margin-top: 10px">
      <van-col span="24" style="background-color: #f8f9f9; height: 3px"></van-col>
    </van-row>
    <!-- 平台说明 -->
    <van-row style="margin-top: 10px">
      <van-col span="24" style="
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          text-align: left;
          padding-left: 10px;">充值金额（资金直冲店主账户，平台不收款不负责）
      </van-col>
    </van-row>
    <!-- 选择充值金额 -->
    <van-row gutter="10">
      <van-col span="8" v-for="item in values" :key="item.index">
        <van-button plain type="primary" style="
            border-radius: 5px;
            font-weight: 700;
            font-size: 20px;
            height: 60px;
            width: 100px;
            margin: 10px 10px 0 10px;" @click="showPay(item.money, item.giveMoney)">{{ item.money }}元<br />
          <span style="color: red; font-weight: 500; font-size: 14px">赠送{{ item.giveMoney
            }}元</span></van-button>&nbsp;&nbsp;
      </van-col>
    </van-row>
    <!-- 背景条 -->
    <van-row>
      <van-col span="24" style="background-color: #f8f9f9; height: 8px">
      </van-col>
    </van-row>
    <!-- 选择支付方式 -->
    <van-row>
      <van-col class="choosePay">选择支付方式</van-col>
    </van-row>
    <!-- 微信支付 -->
    <van-row>
      <van-col span="24">
        <van-image round width="40px" height="40px" :src="imgPath" class="weixin-image" />
        <span class="weixin-text">微信</span>
        <van-radio-group v-model="radio" class="radio">
          <van-radio name="1"></van-radio>
        </van-radio-group>
      </van-col>
    </van-row>
    <!-- 确认选中的金额弹出层 -->
    <van-popup v-model="show" position="bottom" style="height: 50%;text-align: center">
      <div style="
          text-align: left;
          font-size: 18px;
          font-weight: 700;
          margin-top: 5%;
          margin-left: 10px;">
        <van-icon name="shop-collect-o" />
        {{ storeName }}
      </div>
      <!-- 背景条 -->
      <van-row style="margin-top: 18px">
        <van-col span="24" style="background-color: #f8f9f9; height: 8px"></van-col>
      </van-row>
      <div style="
          text-align: center;
          font-size: 30px;
          font-weight: 700;
          margin-top: 10%;margin-bottom: 10px">{{ payMoney }} <span style="font-size: 20px">元</span>
      </div>
      <div style="
          text-align: center;
          font-size: 18px;
          font-weight: 700;
          margin-top: 0;
          color: #07c160;">赠送金额 {{ freeMoney }}
        <span style="font-size: 18px">元，应到账金额：{{ accountMoney }}元</span>
      </div>
      <van-button round type="info" style="width: 90%; margin-top: 10%" @click="toPay">立即充值
      </van-button>
    </van-popup>
    <van-popup v-model:show="dialogVisible" round closeable :style="{ padding: '50px' }" @click-overlay="onClickOverlay"
      @click-close-icon="onClickCloseIcon">
      <div style="text-align: center">
        <p>微信支付 {{ payResult.price }}元</p>
        <div style="border: 1px solid #f3f3f3;width: 220px;padding: 10px; margin: 0 auto">
          <vue-qr :text="payResult.codeUrl" :margin="0" colorLight="#fff" :size="200" style="text-align: center">
          </vue-qr>
        </div>
      </div>
      <div style="font-size: 13px">
        提示:<br>
        支付成功前请勿手动关闭页面<br>
        二维码两小时内有效，请及时扫码支付<br>
      </div>
    </van-popup>
  </div>
</template>
<script>
import axios from 'axios';
import VueQr from 'vue-qr';

export default {
  name: "Payment",
  components: {
    VueQr,
  },
  data() {
    return {
      storeName: "请选择", //门店名称
      storeId: "",
      userId: "",
      values: [
        {
          index: 1,
          money: 30,
          giveMoney: 0.0,
        },
        {
          index: 2,
          money: 50,
          giveMoney: 10.0,
        },
        {
          index: 3,
          money: 100,
          giveMoney: 20.0,
        },
        {
          index: 4,
          money: 200,
          giveMoney: 60.0,
        },
        {
          index: 5,
          money: 300,
          giveMoney: 120.0,
        },
        {
          index: 6,
          money: 400,
          giveMoney: 180.0,
        },
      ], //金额列表
      radio: "1", //单选框默认选中
      imgPath: require("../../../assets/img/paylogo/wexin.png"),
      checked: false, //复选框默认不选
      show: false, //弹出层默认不显示
      payMoney: 0, //支付金额
      freeMoney: 0, //赠送金额
      accountMoney: 0, //实际到账金额
      //支付接口
      payResult: {
        price: 0,
        codeUrl: "",
        orderNo: ""
      },
      dialogVisible: false,
      timer1: "",
      detailNo: "",
      url: "/balance",
    }
  },
  created() {
    this.getStoreName();
    this.init();
  },
  methods: {
    onClickOverlay() {
      //取消订单逻辑
    },
    onClickCloseIcon() {
      //取消订单逻辑
    },
    //获取用户id
    init() {
      axios.get("http://172.16.7.55:7011/mainPage/FrontUser/getUserInfo").then((res => {
        if (res.data.code === 200) {
          this.userId = res.data.data.userId;
        }
      }));
    },
    //获取门店名
    getStoreName() {
      this.storeId = this.$route.query.storeId;
      //判断门店id是否为null
      if (this.storeId != null) {
        //执行查询门店名称的方法
        this.selectStoreName();
      }
    },
    //根据门店id查询门店名称
    selectStoreName() {
      axios.post("http://172.16.7.55:7011/mainPage/store/selectByStoreId?storeId=" + this.storeId).then(resp => {
        this.storeName = resp.data.data.storeName;
      })
    },
    //页面跳转
    jump(uri) {
      this.$router.push(
        uri,
        () => {
        },
        () => {
        }
      );
    },
    //点击充值金额按钮后触发的函数
    showPay(money, giveMoney) {
      //1,判断是否选择门店
      if (this.storeName === "请选择") {
        this.$toast("请先选择充值的门店");
      } else {
        //获取金额
        this.payMoney = money;
        this.freeMoney = giveMoney;
        this.accountMoney = money + giveMoney;
        this.show = true;
      }
    },
    toPay() {
      //开启支付页面
      this.dialogVisible = true;
      //关闭金额弹窗
      this.show = false;
      //初始化值
      this.detailNo = "car" + new Date().getTime();
      this.$http.post("/car/api/getRechargeNative", {
        rechargeMoney: this.payMoney,
        discountsMoney: this.freeMoney,
        accountMoney: this.accountMoney,
        storeId: this.storeId,
        userId: this.userId,
        detailId: this.detailNo,
      }).then((res => {
        this.payResult = res.data.data;
      }));
      // 定时任务，看是否成功支付
      this.timer1 = setInterval(() => {
        this.queryPayStatus(this.payResult.orderNo)
      }, 3000);
    },
    //查询订单支付状态
    queryPayStatus(orderNo) {
      if (orderNo !== "") {
        this.$http.post("/car/api/queryPayStatus/" + this.detailNo).then((res => {
          if (res.data.code === 200) {
            //消除定时器
            clearInterval(this.timer1);
            this.timer1 = null;
            this.$toast.success("支付成功");
            this.dialogVisible = false;
            this.$router.push(this.url);
          } else if (res.data.code === 501) {
            //消除定时器
            clearInterval(this.timer1);
            this.timer1 = null;
            this.$toast.success("订单过期");
            this.dialogVisible = false;
          }
        }))
      }
    }
  }
}
</script>
<style scoped>
.container {
  margin: 10px 0 0 30px;
}

/* 编写样式的 */
.goods-card {
  margin: 0;
  background-color: white;
}

.delete-button {
  height: 100%;
}

/*选择支付方式css */
.choosePay {
  color: black;
  font-size: 17px;
  font-weight: bold;
  text-align: left;
  margin-left: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 微信支付css */
.weixin-image,
.weixin-text {
  float: left;
  margin-left: 15px;
}

.weixin-text {
  font-size: 17px;
  color: black;
  margin-top: 9px;
}

/* 单选框css */
.radio {
  float: right;
  margin-top: 15px;
  margin-right: 15px;
}
</style>