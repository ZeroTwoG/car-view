<template>
  <div>
    <van-sticky>
      <van-nav-bar :title="title" left-text="" left-arrow @click-left="jump" />
    </van-sticky>
    <van-address-edit :area-list="areaList" :address-info="AddressInfo" show-delete show-set-default show-search-result
      show-area :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" @delete="onDelete" />
  </div>
</template>
<script>
import { areaList } from "@vant/area-data";
import axios from "axios";

export default {
  name: "AddressEdit",
  data() {
    return {
      title: "新增地址",
      areaList,
      AddressInfo: {}, //存放地址信息
      userId: "",
    }
  },
  created() {
    this.userId = this.$route.query.userId;
    //获取地址列表传的地址id
    this.userId = this.$route.query.userId;
    let id = this.$route.query.id;
    if (id != null) {
      //地址id存在，执行更新操作
      this.title = "更新地址";
      //发送请求获取地址内容
      axios.get("/my/userAddress/selectOneAddress/" + id).then(res => {
        if (res.data.code === 200) {
          let myAddr = res.data.data;
          //判断是否为默认地址
          let flag = myAddr.flag === "0";
          this.AddressInfo = {
            id: myAddr.addressId, //收货人信息初始值
            name: myAddr.addressName, //姓名
            tel: myAddr.phone, //电话
            province: myAddr.province, //省份
            city: myAddr.city, //城市
            country: myAddr.district, //区县
            areaCode: "",
            addressDetail: myAddr.detail, //详细地址
            isDefault: flag, //是否选择默认
          };
          //根据地区的查询地区code
          this.searchFor();
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  methods: {
    //查询地区编号code
    searchFor() {
      axios.get("/my/area/selectAreaCode?country=" + this.AddressInfo.country + "&city=" + this.AddressInfo.city
        + "&province=" + this.AddressInfo.province).then(res => {
          if (res.data.code === 200) {
            this.AddressInfo.areaCode = res.data.data.code + "";
          } else {
            this.$notify({ type: 'danger', message: '获取地址失败' });
          }
        }).catch(function (error) {
          console.log(error);
        });
    },
    //跳转
    jump() {
      this.$router.push({
        path: "/addressManagement",
        query: { userId: this.userId },
      });
    },
    //更新或者添加地址
    onSave(content) {
      let flag = content.isDefault ? "0" : "1";
      if (!this.$route.query.id) {
        this.form = {
          userId: this.$route.query.userId, //用户id
          addressName: content.name,
          phone: content.tel,
          province: content.province,
          city: content.city,
          district: content.county,
          detail: content.addressDetail,
          flag: flag, //是否是默认地址
        };
        //添加地址
        axios.post("/my/userAddress/addAddress", this.form).then(res => {
          if (res.data.code === 200) {
            this.$toast(res.data.msg);
            this.jump();
          } else {
            this.$notify({ type: 'danger', message: res.data.msg });
          }
        }).catch(function (error) {
          console.log(error);
        });
      } else {
        //更新地址
        this.form = {
          addressId: content.id,
          userId: this.$route.query.userId,
          addressName: content.name,
          phone: content.tel,
          province: content.province,
          city: content.city,
          district: content.county,
          detail: content.addressDetail,
          flag: flag, //是否是默认地址
        };
        //更新地址
        axios.post("/my/userAddress/updateUserAddress", this.form).then(res => {
          if (res.data.code === 200) {
            this.$toast(res.data.msg);
            this.jump();
          } else {
            this.$notify({ type: 'danger', message: res.data.msg });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    //删除地址
    onDelete() {
      let id = this.$route.query.id;
      axios.delete("/my/userAddress/deleteUserAddress?addressId=" + id).then(res => {
        if (res.data.code === 200) {
          this.$toast.success(res.data.msg);
          this.jump();
        } else {
          this.$toast.fail(res.data.msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
  }
}
</script>
<style scoped></style>