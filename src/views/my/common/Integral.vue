<template>
  <div>
    <!-- 头部刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 粘性布局 -->
      <van-sticky>
        <!-- 标题 -->
        <van-row class="titleStyle">
          <van-col span="5" @click="onClickLeft" style="color: #f8f8f8; font-size: 18px;">
            <van-icon name="arrow-left" />
          </van-col>
          <van-col span="14">
            <span style="color: #f8f8f8; font-size: 16px;font-weight: 550">我的积分</span>
            <div class="myIntegral">
              <span v-if="credits != null"> {{ credits }}</span>
              <span v-else>0</span>
            </div>
            <div style="color: white;margin-top: -6px">
              当前积分
            </div>
          </van-col>
          <van-col span="5"></van-col>
        </van-row>
      </van-sticky>
      <van-row style="margin-top: 40px" class="myJump" @click="jump('/StoreBind')">
        <van-col span="6">绑定的门店</van-col>
        <van-col span="16"></van-col>
        <van-col span="2">
          <van-icon name="arrow" style="margin-left: 5px" />
        </van-col>
      </van-row>
      <van-row style="margin-top: 15px" class="myJump" @click="jumpDetail()">
        <van-col span="5">积分明细</van-col>
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
  name: "Integral",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      credits: 0, //查询的用户积分信息
      isLoading: false, //刷新参数
      userId: 0,//用户id
    }
  },
  created() {
    const userDataStr = sessionStorage.getItem("user");
    const userData = JSON.parse(userDataStr);
    this.userId = userData.userId
    this.selectTotalIntegral()
  },
  methods: {
    //积分总额
    selectTotalIntegral() {
      axios.post("/my/userIntegral/selectIntegralByUserId/" + this.userId).then((res => {
        if (res.data.code === 200) {
          this.credits = res.data.data;
        }
      }))
    },
    //页面刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.init();
        this.isLoading = false;
        //调用请求
      }, 1000);
    },
    jumpDetail() {
      this.$router.push({
        path: "/detailIntegral",
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
  height: 125px;
  padding: 20px 10px;
  line-height: 35px;
  text-align: center;
  background: linear-gradient(to bottom right, #3bb6ef 55%, #9fdefc);
}

.myIntegral {
  font-size: 28px;
  font-weight: 600;
  color: white;
  padding-top: 25px;
}

.myJump {
  padding-left: 10px;
  font-size: 15px;
  font-weight: 550;
  letter-spacing: 1px;
}
</style>