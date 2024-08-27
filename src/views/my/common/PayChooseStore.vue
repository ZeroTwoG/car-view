<template>
  <!-- 书写html结构 只可以有一个div 但是可以嵌套多个div -->
  <div>
    <van-sticky>
      <!-- 导航栏 -->
      <van-nav-bar title="选择门店" left-text="" left-arrow @click-left="returnTo"></van-nav-bar>

      <!-- 搜索框 -->
      <van-row style="margin-top: 9px">
        <van-col span="21">
          <van-search v-model="selectMsg.storeName" shape="round" placeholder="搜索关键词" />
        </van-col>
        <van-col span="3" style="margin-top: 15px; text-align: left; font-size: 24px">
          <van-icon name="search" @click="selectAllStore" />
        </van-col>
      </van-row>
    </van-sticky>

    <!-- 列出店铺信息 -->
    <div v-for="item in storeInfo" style="margin-left: 15px" :key="item.storeId">
      <van-radio-group v-model="radio">
        <van-radio style="margin-top: 18px; margin-bottom: 18px;font-size: 15px" :name="item.storeId">{{ item.storeName
          }}
        </van-radio>
        <div style="background: #f6f6f6; height: 1px"></div>
        <!-- 确定按钮 -->
        <van-tabbar style="height: 8%">
          <van-col span="24" style="text-align: center">
            <van-button round type="info" style="width: 90%" @click="chooseStore(radio)">确定
            </van-button>
          </van-col>
        </van-tabbar>
      </van-radio-group>
    </div>
    <div style="height: 333px"></div>
  </div>
</template>
<!--书写组件配置项目  相当于写js代码的地方 -->
<script>
import axios from 'axios';

//数据 全是json格式
export default {
  //注册属性 父传子 数据传递
  props: {},
  data() {
    //定义数据
    return {
      storeName: "", //搜索框输入的门店名称
      storeInfo: [], //存放店铺信息
      radio: "", //单框的双向绑定
      returnStoreName: "", //确定选择的门店后，返回的门店名称
      selectMsg: {
        storeName: ''
      },//查询的数据
    };
  },
  //初始化数据
  created() {
    this.selectAllStore();
  },
  //方法书写
  methods: {
    //查询门店信息
    selectAllStore() {
      axios.post("http://172.16.7.55:7011/my/store/searchStore?storeName=" + this.selectMsg.storeName).then(resp => {
        this.storeInfo = resp.data.data;
      }).catch(function (error) {
        console.log(error);
      });
    },

    //确定选择的门店
    chooseStore(radio) {
      //跳转页面时传参
      this.$router.push({
        path: "/payment",
        query: { storeId: radio },
      });
    },
    //返回上一级
    returnTo() {
      this.$router.push("/payment");
    },
  },
  //声明注解
  components: {},
};
</script>
<style scoped></style>
