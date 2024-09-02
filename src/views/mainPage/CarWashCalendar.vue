<template>
  <!-- 书写html结构 -->
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="洗车日历" left-text="返回" left-arrow @click-left="jump('/home')" />

    <van-row style="height: 160px; background-color: #54c7fc; color: #ffffff">
      <van-col span="24">
        <van-row style="height: 70px; margin-top: 20px; line-height: 50px">
          <van-col span="2"></van-col>
          <van-col span="4">
            <!-- 用户头像 -->
            <van-image round width="4rem" height="4rem" :src="info.avatar" />
          </van-col>
          <van-col span="2"></van-col>
          <!-- 用户手机号 -->
          <van-col span="16" style="text-align: left">{{
            info.userName
            }}
          </van-col>
        </van-row>
      </van-col>
      <van-row style="height: 70px;font-size: 15px">
        <van-col span="8" style="text-align: center">
          <div>{{ registerDay }}天</div>
          加入ETCC
        </van-col>
        <van-col span="8" style="text-align: center">
          <div>{{ info.storeNumber }} 个</div>
          服务门店
        </van-col>
        <van-col span="8" style="text-align: center">
          <div>{{ info.washNumber }} 次</div>
          服务次数
        </van-col>
      </van-row>
    </van-row>
    <!-- 日历 -->
    <div>
      <van-calendar :v-model="selectedDate" @confirm="handleClick" :min-date="minDate" :max-date="maxDate"
        :poppable="false" :show-confirm="false" :style="{ height: '400px', width: '100%' }" />
    </div>
    <hr />
    <p style="text-align: left;font-size: 25px;font-weight: normal;margin-left: 20px;">
      洗车记录
    </p>
    <!--洗车记录-->
    <p style="margin-left: 20px">
      {{ record }}
    </p>
    <van-row style="margin-top: 10px; margin-left: 9px; text-align: left;" v-for="item in carWashInfo"
      :key="item.orderId">
      <van-col span="24" style="font-size: 20px; font-weight: normal; margin-left: 10px">
        <div style="margin-bottom: 10px">店铺名称: {{ item.store.storeName }}</div>
        <div style="margin-bottom: 10px">车牌号: {{ item.carNo }}</div>
        <div style="margin-bottom: 10px">洗车时长: {{ item.useTime }}分钟</div>
        <div style="margin-bottom: 10px">
          洗车支付金额: ￥ {{ item.payMoney }}
        </div>
        <div style="margin-bottom: 10px" v-if="item.content != null">
          <van-button type="primary" plain size="mini">已评价</van-button>
        </div>
        <div style="margin-bottom: 10px" v-else>
          <van-button type="primary" size="mini" @click="
            goStoreComment(
              item.store.storeName,
              item.orderId,
              item.storeId,
              item.userId
            )
            ">去评价
          </van-button>
        </div>
      </van-col>
      <hr />
    </van-row>
    <p v-if="carWashInfo.length == 0" style="padding-bottom: 100px"></p>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    //定义数据的地方
    return {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      selectedDate: new Date(),
      date: "",
      record: '',//洗车记录提示
      show: true,
      list: [],
      loading: false,
      finished: false,
      //用户信息
      info: {
        avatar: "", //头像路径
        userId: "", //用户id
        userName: "", //用户名
        registerTime: "", //注册时间
        storeNumber: "", //绑定的门店数
        washNumber: "0", //洗车次数
      },
      carWashInfo: [], //洗车记录
    };
  },
  created() {
    const userDataStr = sessionStorage.getItem("user");
    const userData = JSON.parse(userDataStr);
    this.info.userId = userData.userId
    this.initInfo();

  },
  mounted() {
    // 生命周期  挂载完成后
  },
  methods: {
    //1,根据token查询当前登录用户信息
    initInfo() {
      axios.get("/mainPage/FrontUser/getUserInfo?userId=" + this.info.userId).then(res => {
        if (res.data.code === 200) {
          this.info.userName = res.data.data.userName;
          this.info.avatar = res.data.data.avatar;
          this.info.userId = res.data.data.userId;
          this.info.registerTime = res.data.data.createTime;
          //调用用户注册天数的方法
          this.registerDay(this.info.registerTime);
          this.selectStoreNumber();
          this.selectWashNumber();
          this.handleClick(new Date());
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    //2,查询用户注册天数
    registerDay(registerTime) {
      let time = new Date();
      let day = new Date(time).getTime() - new Date(registerTime).getTime(); //日期转时间戳
      //时间戳获取天数
      this.registerDay = Math.floor(day / 86400000); //得到注册天数
    },

    //3，查询绑定的门店数
    selectStoreNumber() {
      axios.post("/nearShop/frontUserStore/selectStoreBind?userId=" + this.info.userId).then(resp => {
        this.info.storeNumber = resp.data.data.length;
      }).catch(function (error) {
        console.log(error);
      });
    },

    //4，查询服务次数
    selectWashNumber() {
      axios.get("/nearShop/carWashRecord/selectNumByUserId?userId=" + this.info.userId)
        .then(response => {
          if (response.data.code == 200) {
            this.info.washNumber = response.data.data
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 1; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 3) {
          this.finished = true;
        }
      }, 1000);
    },
    //页面跳转
    //跳转页面的方法
    jump(uri) {
      this.$router.push(uri);
    },

    //点击日历上的日期，触发函数
    handleClick(values) {
      //1，格式化选中的日期
      let tmp = moment(values).format("YYYY-MM-DD");
      //2,请求后端方法
      console.log(this.info);

      axios.post("/nearShop/carWashRecord/selectRecordByUserId?userId=" +
        this.info.userId +
        "&createDate=" +
        tmp
      )
        .then(response => {
          if (response.data.code == 200) {
            this.carWashInfo = response.data.data;
            this.carWashInfo = this.carWashInfo.filter(item => {
              return item.washStatus == '1';
            })
            this.record = ""
            if (this.carWashInfo.length === 0) {
              this.record = "暂无洗车记录";
            }
          } else {
            this.carWashInfo = [];
            this.record = "暂无洗车记录";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //跳转评价页面
    goStoreComment(storeName, orderId, storeId, userId) {
      this.$router.push({
        path: "/StoreComment",
        query: {
          storeName: storeName,
          orderId: orderId,
          userId: userId,
          storeId: storeId,
        },
      });
    },
  },
};
</script>

<style scoped></style>
