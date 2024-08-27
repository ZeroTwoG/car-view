<template>
  <div>
    <!-- 头部刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 粘性布局 -->
      <van-sticky>
        <!-- 标题 -->
        <van-row class="titleStyle">
          <van-col span="5" @click="jump('/my')" style="color: #f8f8f8; font-size: 18px;">
            <van-icon name="arrow-left" />
          </van-col>
          <van-col span="14">
            <span style="color: #f8f8f8; font-size: 16px;font-weight: 550">我的余额</span>
          </van-col>
          <van-col span="5"></van-col>
        </van-row>
      </van-sticky>
      <div style="text-align: center">
        <div class="myBalance">
          <span v-if="balance != null"> {{ balance }}</span>
          <span v-else>0</span>
        </div>
        <div style="color: grey;margin-top: 5px">
          当前余额(元)
        </div>
      </div>
      <div style="text-align: center;height: 80px;display: flex;justify-content: center; align-items: center;">
        <van-button @click="jump('/payment')" round
          style="width: 150px;color: white;background-color:#019fe8;margin-right: 10px">充值
        </van-button>
        <van-button round style="width: 150px;color: #01abee;border: 1px solid #01abee">兑换余额</van-button>
      </div>
      <van-row style="margin-top: 40px" class="myJump" @click="jump('/StoreBind')">
        <van-col span="6">绑定的门店</van-col>
        <van-col span="16"></van-col>
        <van-col span="2">
          <van-icon name="arrow" style="margin-left: 5px" />
        </van-col>
      </van-row>
      <van-row style="margin-top: 15px" class="myJump" @click="jumpDetail()">
        <van-col span="5">余额明细</van-col>
        <van-col span="13"></van-col>
        <van-col span="6">
          <span style="color:#3bb6ef">查看全部</span>
          <van-icon name="arrow" />
        </van-col>
      </van-row>
      <van-empty description="暂无数据" />
      <!-- 常用功能 -->
    </van-pull-refresh>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: "Balance",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      credits: 0, //查询用户积分信息
      balance: 0,//查询用户的余额
      isLoading: false, //刷新参数
      userId: 0,//用户id
    }
  },
  created() {
    const userDataStr = sessionStorage.getItem("user");
    const userData = JSON.parse(userDataStr);
    this.userId = userData.userId
    this.selectTotalIntegral()
    this.selectTotalBalance();
  },
  methods: {
    //积分总额
    selectTotalIntegral() {
      axios.post("http://172.16.7.55:7011/my/userIntegral/selectIntegralByUserId/" + this.userId).then(res => {
        if (res.data.code === 200) {
          this.credits = res.data.data;
        }
      })
    },
    //余额
    selectTotalBalance() {
      axios.post("http://172.16.7.55:7011/my/userBalance/selectBalanceByUserId/" + this.userId).then((res => {
        if (res.data.code === 200) {
          this.balance = res.data.data;
        }
      }))
    },
    //页面刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.selectTotalIntegral()
        this.selectTotalBalance(this.userId);
        this.isLoading = false;
        //调用请求
      }, 1000);
    },
    jumpDetail() {
      this.$router.push({
        path: "/detailBalance",
        query: { userId: this.userId },
      })
    },
    //跳转
    jump(uri) {
      this.$router.push(
        uri,
        () => {
        },
        () => {
        }
      );
    },
  }
}
</script>
<style scoped>
.titleStyle {
  height: 25px;
  padding: 20px 10px;
  line-height: 35px;
  text-align: center;
  background: linear-gradient(to bottom right, #3bb6ef 55%, #9fdefc);
}

.myBalance {
  font-size: 28px;
  font-weight: 600;
  color: black;
  padding-top: 25px;
}

.myJump {
  padding-left: 10px;
  font-size: 15px;
  font-weight: 550;
  letter-spacing: 1px;
}
</style>