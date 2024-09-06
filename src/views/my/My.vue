<template>
  <div>
    <!-- 顶层消息框 -->
    <van-sticky>
      <van-row class="myMessage">
        <van-col span="4">
          <!-- 主页提示信息 -->
          <van-icon name="bell" style="font-size: 20px" color="#fff" @click="jump('msgHome')" />
        </van-col>
        <van-col span="20"></van-col>
      </van-row>
    </van-sticky>
    <!-- 空白 -->
    <van-row style="height: 20px; background-color: #10a4ea">
      <van-col span="24"></van-col>
    </van-row>
    <!-- 头像 -->
    <van-row class="myImage">
      <van-col span="6">
        <van-image round width="80px" height="80px" :src="imageURL" @click="jump('personInfo')" />
      </van-col>
      <!-- 昵称 -->
      <van-col span="15">
        <div style="padding-top: 20px; float: left; font-size: 20px; color: #fff">
          <span v-if="userName === '注册/登录'" @click="jump('login')">注册/登录</span>
          <span v-else @click="jump('personInfo')">&nbsp;{{ userName }}</span>
        </div>
      </van-col>
      <van-col span="3"></van-col>
    </van-row>
    <!-- 洗车卡 -->
    <van-row @click="remind">
      <van-col span="2"></van-col>
      <van-col span="20" class="myWash">
        <div style="float: left; padding-left: 5%">
          <span></span><br />
          <span style="font-size: 15px; color: #89452f">购买洗车卡</span><br />
          <span style="font-size: 12px; color: #89452f">享受更多优惠</span>
        </div>
        <van-button type="default" style="
              margin-left: 30%;
              margin-top: 25px;
              border: 0;
              width: 80px;
              height: 30px;
              font-size: 12px;
              background: #874f09;
              color: #fff;">
          立即购买
        </van-button>
      </van-col>
      <van-col span="2"></van-col>
    </van-row>
    <!-- 留白 -->
    <van-row style="height: 20px">
      <van-col span="24"></van-col>
    </van-row>
    <div class="myContainer">
      <van-cell-group inset>
        <van-cell title="常用功能" style="font-weight: bold" />
        <van-grid square :gutter="10" :column-num="4" :border="false">
          <van-grid-item icon="gold-coin" text="我的余额" @click="jump('/balance')" />
          <van-grid-item icon="gem" text="我的积分" @click="jump('/integral')" />
          <van-grid-item icon="wap-home" text="我的车辆" @click="jump('/myCar')" />
          <van-grid-item icon="shop-collect" text="绑定门店" @click="jump('/StoreBind')" />
          <van-grid-item icon="music" text="全民音乐" @click="jump('/Music')" />
          <van-grid-item icon="phone" text="加盟开店" @click="Dialog" />
        </van-grid>
      </van-cell-group>
      <van-cell-group inset style="margin-top: 20px">
        <van-cell title="我的订单" style="font-weight: bold" />
        <van-grid square :gutter="10" :column-num="5" :border="false">
          <van-grid-item icon="credit-pay" text="待付款" @click="jump('/unpaid?statusCode=1')" />
          <van-grid-item icon="tosend" text="待发货" @click="jump('/unpaid?statusCode=2')" />
          <van-grid-item icon="logistics" text="待收货" @click="jump('/unpaid?statusCode=3')" />
          <van-grid-item icon="comment-circle-o" text="已完成" @click="jump('/unpaid?statusCode=4')" />
          <van-grid-item icon="close" text="取消" @click="jump('/unpaid?statusCode=5')" />
        </van-grid>
      </van-cell-group>
      <van-cell-group inset style="margin-top: 20px;margin-bottom: 60px">
        <van-cell title="必备工具" style="font-weight: bold" />
        <van-grid square :gutter="10" :column-num="4" :border="false">
          <van-grid-item icon="play-circle-o" text="洗车教程" @click="jump('/washCarCourse')" />
          <van-grid-item icon="label-o" text="服务协议" @click="jump('/serviceAgreement')" />
          <van-grid-item icon="description-o" text="操作指南" @click="jump('/instructions')" />
          <van-grid-item icon="location-o" text="地址管理" @click="goAddressList()" />
          <van-grid-item icon="info-o" text="关于我们" @click="jump('/AboutUs')" />
          <van-grid-item icon="setting-o" text="设置" @click="jump('/systemSetting')" />
          <!--          <van-grid-item icon="filter-o" text="蓝色水源" @click="jump('')"/>-->
        </van-grid>
      </van-cell-group>
    </div>

    <!-- 头部刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 底部标签 -->
      <van-tabbar v-model="active" active-color="#ee0a24">
        <van-tabbar-item name="home" icon="coupon" @click="jump('/home')">
          主页
        </van-tabbar-item>
        <van-tabbar-item name="search" icon="send-gift" @click="jump('/nearByStore')">
          推荐门店
        </van-tabbar-item>
        <van-tabbar-item name="shop" icon="shopping-cart" @click="jump('/store')">
          商城
        </van-tabbar-item>
        <van-tabbar-item name="my" icon="contact" @click="jump('/my')">
          我的
        </van-tabbar-item>
      </van-tabbar>

    </van-pull-refresh>
  </div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

export default {
  data() {
    return {
      userInfo: {},//用户信息
      isLoading: false, //刷新参数
      active: "my", //底部标签绑定
      userId: "",
      userName: "", //用户名
      imageURL: "https://ts1.cn.mm.bing.net/th/id/R-C.67c70ed0eae200d69455a91b43a9f407?rik=JuGKKn2ExyU9PA&riu=http%3a%2f%2fwww.sucaijishi.com%2fuploadfile%2f2018%2f0508%2f20180508023717621.png&ehk=KU69IZrBC4o1Y88Iab8ZKx9FGLndJcignKsCkX31gds%3d&risl=&pid=ImgRaw&r=0", //头像路径
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user"));
    this.userName = this.userInfo.userName
    this.imageURL = this.userInfo.avatar
    this.userId = this.userInfo.userId
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
    //跳转页面的方法
    jump(uri) {
      this.$router.push(uri);
    },
    //加盟开店
    Dialog() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "请拨打电话 4000999747",
          confirmButtonColor: "red",
        })
        .then(() => {
          console.log("确认");
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //跳转地址管理
    goAddressList() {
      this.$router.push({
        path: "/addressManagement",
        query: {
          //传递到跳转页面的值
          userId: this.userId,
        },
      });
    },
    //洗车卡
    remind() {
      this.$toast("暂无开通洗车卡服务");
    },
  }
}
</script>
<style scoped>
body {
  background-color: #f8f8f8;
}

.myContainer {
  background-color: #f8f8f8;
  padding-top: 20px;
  padding-bottom: 20px;
}

.myMessage {
  height: 20px;
  padding-top: 15px;
  padding-bottom: 10px;
  line-height: 20px;
  background-color: #10a4ea;
  padding-left: 40px;
}

.myImage {
  height: 150px;
  background-color: #10a4ea;
  padding-left: 20px;
}

.myWash {
  height: 80px;
  margin-top: -50px;
  background-color: #edd7a8;
  border-radius: 10px;
}
</style>