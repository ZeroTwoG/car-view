<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的车辆" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <van-empty description="暂无车辆信息" v-show="flag" />
    <van-row style="margin: 18px; text-align: left;font-size: 14px" @click="goStoreBindCar(item.carNo)"
      v-for="item in carList" :key="item.carNo">
      <van-col span="12">
        {{ item.carNo }}
        <div>姓名: {{ item.userName }}</div>
        <div>手机号: {{ item.phone }}</div>
      </van-col>
      <van-col span="5"></van-col>
      <van-col span="7" style="margin-bottom: 15px">
        <span>绑定门店{{ item.storeNumber }}家</span>
        <div style="visibility: hidden">填充</div>
        <div @click.stop="DelDialog(item.carNo)" style="text-align: right; margin-right: 18px">
          <a style="text-decoration: none; color: red">删除</a>
        </div>
      </van-col>
      <hr>
    </van-row>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: "MyCar",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  created() {
    this.initCar();
  },
  data() {
    //定义数据的地方
    return {
      carList: [], //存放添加的车辆信息
      flag: true,
    };
  },
  methods: {
    initCar() {
      const userDataStr = sessionStorage.getItem("user");
      axios.get("/my/car/carBind/" + (JSON.parse(userDataStr)).userId).then(res => {
        if (res.data.code === 200) {
          this.flag = false;
          this.carList = res.data.data;
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    goStoreBindCar(carNo) {
      axios.get("/my/car/findCarId?carNo=" + carNo).then(res => {
        if (res.data.code === 200) {
          this.address = res.data.data;
          this.$router.push({
            path: "/carBindStore",
            query: { carId: res.data.data.carId },
          })
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    //（确认、取消）的弹出框
    DelDialog(carNo) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定删除该车牌吗？",
          confirmButtonColor: "#2979FF",
        })
        .then(() => {
          //调用删除绑定的车辆
          this.dropBindCar(carNo);
        })
        .catch(() => {
        });
    },
    //删除绑定的车辆
    dropBindCar(carNo) {
      axios.delete("/my/car/deleteCarNo/" + carNo).then(res => {
        if (res.data.code === 200) {
          this.$notify({ type: 'success', message: res.data.msg });
          this.initCar();
        } else {
          this.$notify({ type: 'danger', message: res.data.msg });
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>
<style scoped></style>