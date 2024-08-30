<template>
  <div>
    <!-- 积分明细 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 粘性布局 -->
      <van-sticky>
        <!-- 标题 -->
        <van-nav-bar title="积分明细" left-arrow @click-left="onClickLeft" />
      </van-sticky>
      <!-- 空白 -->
      <van-tabs v-model="active">
        <van-tab title="全部">
          <van-empty description="暂无积分明细" v-show="flag" />
          <van-col span="24">&nbsp;</van-col>
          <van-row style="font-size: 18px; font-weight: 550" v-for="item in integralLog" justify="space-around"
            :key="item.integralLogId">
            <van-cell>
              <span style="font-size: 18px; font-weight: 700">
                {{ item.storeName }}
              </span>
            </van-cell>
            <!-- 充值时间 -->
            <van-col span="13" style="margin-left: 15px" v-if="item.arrivalScore >= 1">{{ item.rechargeTime }}
            </van-col>
            <van-col span="3" v-if="item.arrivalScore >= 1"></van-col>
            <van-col span="6" style="color: green" v-if="item.arrivalScore >= 1">+{{ item.arrivalScore }}</van-col>
            <!-- 支出时间 -->
            <van-col span="13" style="margin-left: 15px" v-if="item.arrivalScore <= 0">{{ item.rechargeTime }}
            </van-col>
            <van-col span="3" v-if="item.arrivalScore <= 0"></van-col>
            <van-col span="6" style="color: red" v-if="item.arrivalScore <= 0">- {{ item.expendScore }}
            </van-col>
            <van-cell>
              <hr />
            </van-cell>
          </van-row>
        </van-tab>

        <!-- 收入记录 -->
        <van-tab title="收入记录">
          <van-empty image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="暂无收入信息" v-show="flag1" />
          <van-col span="24">&nbsp;</van-col>
          <van-row style="text-align: left; font-size: 18px; font-weight: 700" v-for="item in incomeInfo"
            :key="item.integralLogId">
            <van-cell><span style="font-size: 18px; font-weight: 700">{{ item.storeName }}</span></van-cell>
            <!-- 充值时间 -->
            <van-col span="13" style="margin-left: 15px" v-if="item.arrivalScore >= 1">{{ item.rechargeTime }}
            </van-col>
            <van-col span="3" v-if="item.arrivalScore >= 1"></van-col>
            <van-col span="6" style="color: green" v-if="item.arrivalScore >= 1">+ {{ item.arrivalScore }}
            </van-col>
            <van-cell>
              <hr />
            </van-cell>
          </van-row>
        </van-tab>

        <!-- 支出 -->
        <van-tab title="支出记录">
          <van-empty description="暂无支出信息" v-show="flag2" />
          <van-col span="24">&nbsp;</van-col>
          <van-row style="text-align: left; font-size: 18px; font-weight: 700" v-for="item in expendInfo"
            :key="item.integralLogId">
            <van-cell>
              <span style="font-size: 18px; font-weight: 700" v-if="item.arrivalScore <= 0">{{ item.storeName }}</span>
            </van-cell>
            <!-- 充值时间 -->
            <van-col span="13" style="margin-left: 15px" v-if="item.arrivalScore <= 0">{{ item.rechargeTime }}
            </van-col>
            <van-col span="3" v-if="item.arrivalScore <= 0"></van-col>
            <van-col span="6" style="color: red" v-if="item.arrivalScore <= 0">- {{ item.expendScore }}
            </van-col>
            <van-cell>
              <hr />
            </van-cell>
          </van-row>
        </van-tab>
      </van-tabs>
    </van-pull-refresh>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment'

export default {
  name: "DetailIntegral",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    //定义数据的地方
    return {
      active: 0,
      isLoading: false, //刷新参数
      integralLog: [], //积分日志明细信息
      incomeInfo: [], //积分收入记录
      expendInfo: [], //积分支出记录
      flag: true,
      flag1: true,
      flag2: true,
      userId: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.userId = this.$route.query.userId;
      axios.get("/my/userIntegral/selectCreditsDetail?userId=" + this.userId).then((res => {
        if (res.data.code === 200) {
          this.integralLog = res.data.data.all;
          this.incomeInfo = res.data.data.in;
          this.expendInfo = res.data.data.out;
          if (this.integralLog.length >= 1) {
            for (let i = 0; i < this.integralLog.length; i++) {
              //格式化时间
              let a = this.integralLog[i].rechargeTime;
              this.integralLog[i].rechargeTime = moment(a).format("YYYY-MM-DD HH:mm:ss");
            }
            this.flag = false;
          } else {
            this.flag = true;
          }
          if (this.incomeInfo.length >= 1) {
            for (let i = 0; i < this.incomeInfo.length; i++) {
              //格式化时间
              let a = this.incomeInfo[i].rechargeTime;
              this.incomeInfo[i].rechargeTime = moment(a).format("YYYY-MM-DD HH:mm:ss");
            }
            this.flag1 = false;
          } else {
            this.flag1 = true;
          }
          if (this.expendInfo.length >= 1) {
            for (let i = 0; i < this.expendInfo.length; i++) {
              //格式化时间
              let a = this.expendInfo[i].rechargeTime;
              this.expendInfo[i].rechargeTime = moment(a).format("YYYY-MM-DD HH:mm:ss");
            }
            this.flag2 = false;
          } else {
            this.flag2 = true;
          }
        }
      }))
    },
    //刷新方法
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.init();
        this.isLoading = false;
        //调用请求
      }, 1000);
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
  },
}
</script>

<style scoped></style>