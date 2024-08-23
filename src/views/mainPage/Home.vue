<template>
  <div>
    <!-- 头部刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 粘性布局 -->
      <van-sticky>
        <!-- 标题 -->
        <van-row style="height: 50px; line-height: 50px; background-color: #ffffff">
          <van-col span="4">
            <!-- 主页提示信息 -->
            <van-icon name="chat-o" class="myMessage" @click="jump('')" />
          </van-col>
          <van-col span="16" style="text-align: center">ETCC自助洗车</van-col>
          <van-col span="4"></van-col>
        </van-row>
      </van-sticky>
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" :autoplay="1500" indicator-color="white">
        <van-swipe-item v-for="(image) in images">
          <img @click="jump('AA')" :src="image" style="height: 195px; width: 100%; border-radius: 7px" />
        </van-swipe-item>
      </van-swipe>
      <!--获取天气-->
      <van-row class="weather">
        <van-col span="5">
          <!-- 城市 -->
          <van-icon name="location-o" color="blue" />
          <span> {{ weather.city }}</span>
        </van-col>
        <van-col span="11">
          <!--天气-->
          <div style="text-align: center;font-size:22px;font-weight: 550">{{ weather.temperature }}℃</div>
          <div style="display: flex;justify-content: space-between;margin-top: 15px">
            <div>今天</div>
            <div>|</div>
            <div>{{ weather.weather }}</div>
            <div>|</div>
            <div>{{ weather.winddirection }}风</div>
            <div>{{ weather.windpower }}级</div>
          </div>
        </van-col>
        <van-col span="8">
          <!--预告-->
          <div style="display: flex;justify-content: space-between;padding-left: 20px">
            <div style="text-align: center;margin-top: 5px;font-size: 14px">
              <div>明天</div>
              <div>{{ tomorrow.nighttemp }}/{{ tomorrow.daytemp }}</div>
              <div style="margin-top: 5px">{{ tomorrow.dayweather }}</div>
            </div>
            <div style="text-align: center;margin-top: 5px;font-size: 14px">
              <div>后天</div>
              <div>{{ afterTomorrow.nighttemp }}/{{ afterTomorrow.daytemp }}</div>
              <div style="margin-top: 5px">{{ afterTomorrow.dayweather }}</div>
            </div>
          </div>
        </van-col>
      </van-row>
      <!-- 选项 -->
      <div style="display: flex;justify-content: space-between;margin-top: 20px">
        <van-row style="height: 70px;width: 100%;text-align: center">
          <van-col span="6" @click="jump('/payment')">
            <van-icon name="paid" size="40" color="#3ca9b5" />
            <br />充值
          </van-col>
          <van-col span="6" @click="jump('/SelectARecord')">
            <van-icon name="sign" size="40" color="#3ca9b5" />
            <br />结算
          </van-col>
          <van-col span="6" @click="jump('/BindCar')">
            <van-icon name="logistics" size="40" color="#3ca9b5" />
            <br />添加车辆
          </van-col>
          <van-col span="6" @click="jump('/carWashCalendar')">
            <van-icon name="calendar-o" size="40" color="#3ca9b5" />
            <br />日历
          </van-col>
        </van-row>
      </div>
      <!--首页门店信息-->
      <div id="storeDetail">
        <van-row style="margin-top: 15px; margin-bottom: 10px;margin-left: 8px">
          <van-col span="18" style="font-weight: normal; font-size: 16px; margin-left: 10px;">
            附近门店 <span style="color: #666666">全国已有店铺{{ storeLength }}家</span>
          </van-col>
          <van-col span="4">
            <!-- 导航栏 -->
            <a @click="jump('/nearByStore')" style="text-decoration: none; color: #019FE8">更多</a>
            <van-icon name="arrow" color="blue" />
          </van-col>
        </van-row>
        <div id="storeMsg" style="margin-bottom: 50px">
          <div v-for="item in store" @click="goStoreInfo(item.storeId, item.averageStar, item.storeDistance)">
            <van-card :thumb="item.storeimage" style="background-color: white">
              <template #tags>
                <!--门店名称-->
                <van-cell class="storeName" style="font-weight: normal;font-size: 20px;color: black">{{
                  item.storeName
                  }}
                </van-cell>
                <!--门店星级-->
                <div class="interval">
                  <van-rate color="rgb(255, 167, 56)" v-model="item.averageStar" size="18px" allow-half readonly />
                  <!-- 门店距离 -->
                  <span class="distance">{{ item.storeDistance }}km</span>
                </div>
                <div class="interval">
                  <van-tag type="primary" size="medium">工位:&nbsp;&nbsp;{{ item.stationNumber }}
                  </van-tag>
                  &nbsp;
                  <van-tag color="#00cc00" size="medium">空闲:&nbsp;&nbsp;{{ item.stationIdle }}
                  </van-tag>
                  &nbsp;
                  <van-tag color="#FFA500" size="medium" v-if="item.stationUsed != 0">使用中:&nbsp;&nbsp;{{
                    item.stationUsed
                    }}
                  </van-tag>
                </div>
                <!-- 门店标签 -->
                <div class="interval">
                  <van-tag class="keyword" v-for="(item1, index) in item.storeLabel" :key="index"
                    :list="item1.storeLabel">{{ item1 }}
                  </van-tag>&nbsp;
                </div>
                <!-- 门店地址 -->
                <van-cell class="address">
                  <van-icon name="location" color="skyblue" />
                  {{ item.address }}
                </van-cell>
              </template>
            </van-card>
          </div>
        </div>
      </div>
      <!-- 底部标签 -->
      <van-tabbar v-model="active" active-color="#ee0a24">
        <van-tabbar-item name="home" icon="coupon" @click="jump('/home')">
          主页
        </van-tabbar-item>
        <van-tabbar-item name="search" icon="location" @click="jump('/nearByStore')">
          附近门店
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
      isLoading: false, //刷新参数
      //选择的地址
      address: {
        storeName: '',
        province: "",
        city: "",
        rectangle: '',
      },
      //全国门店数量
      storeLength: 0,
      //门店信息
      store: [],
      active: "home", //底部标签绑定
      images: [
        //轮播图
        require("../../assets/img/carousel/carousel-1.png"),
        require("../../assets/img/carousel/carousel-2.png"),
        require("../../assets/img/carousel/carousel-3.png"),
      ],
      //高德地图的key
      key: "6cefb344ace6ca9783a0fede07ade4a9",
      cityDetail: {
        adcode: "",//城市编号
      },
      weather: {
        //主页地区天气
        city: "", //城市
        temperature: "", //温度
        weather: "", //天气
        winddirection: "", //风向
        windpower: "", //风级
        userId: "",//用户id
      },
      //预报
      tomorrow: {},
      afterTomorrow: {},
      //返回的url
      backUrl: "/home",
    }
  },
  created() {
    this.getLocationInfo();
    this.getCity();
    this.init();
  },
  methods: {
    init() {
      axios.get("http://172.16.7.55:7011/mainPage/FrontUser/getUserInfo").then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data);
          this.userId = res.data.data.userId;
        }
      });
    },
    //获取当前所在的城市
    getCity() {
      fetch(
        `https://restapi.amap.com/v3/ip?key=` + this.key
      ).then((res => {
        return res.text();
      })).then((json => {
        this.cityDetail = JSON.parse(json);
        this.getWeather(this.cityDetail.adcode);
      }))
    },
    //查询城市的天气
    getWeather(adcode) {
      //查询今日的天气
      fetch('https://restapi.amap.com/v3/weather/weatherInfo?key=' + this.key + "&city=" + adcode).then((res => {
        return res.text();
      })).then((json => {
        //结果为一个list，获取下标为0的数据
        this.weather = JSON.parse(json).lives[0];
        let a = this.weather.windpower;
        this.weather.windpower = a.replace(/≤/, "1-");
      }));
      //天气预报
      fetch('https://restapi.amap.com/v3/weather/weatherInfo?extensions=all&key=' + this.key + "&city=" + adcode).then((res => {
        return res.text();
      })).then((json => {
        this.tomorrow = JSON.parse(json).forecasts[0].casts[0];
        this.afterTomorrow = JSON.parse(json).forecasts[0].casts[1];
      }))
    },
    //刷新方法
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.getLocationInfo();
        this.getCity();
        this.init();
        this.isLoading = false;
        //调用请求
      }, 1000);
    },
    //async 用于申明一个 function 是异步的，
    // 获取用户位置信息
    async getLocationInfo() {
      var _this = this;
      fetch("https://restapi.amap.com/v3/ip?key=" + this.key)
        .then(function (response) {
          return response.text();
        })
        .then(function (myJson) {
          // myJson 是一个json字符串
          _this.data1 = JSON.parse(myJson); //把json字符串转为json数组
          _this.address.rectangle = _this.data1.rectangle; //获取当前位置的经纬度
          _this.loadAllStore(_this.address);
        });
    },
    //点击店铺跳转
    goStoreInfo(storeId, averageStar, storeDistance) {
      this.$router.push({
        path: "/StoreInformation",
        query: {
          storeId: storeId,
          averageStar: averageStar,
          storeDistance: storeDistance,
        },
      });
    },
    //加载所有店铺信息
    loadAllStore(address) {
      axios.get("http://172.16.7.55:7011/mainPage/store/selectStore?rectangle=" + address.rectangle + "&storeName=" + address.storeName).then(resp => {
        this.store = resp.data.data;
        this.storeLength = this.store.length;
        let i = 0;
        this.store = this.store.filter(function (item) {
          i++;
          if (i > 3) {
            return;
          }
          return item;
        });
      })
    },

    //跳转页面的方法
    jump(url) {
      this.$router.push({
        path: url,
        query: { myUrl: this.backUrl },
      })
    },
  }
}
</script>
<style scoped>
/* 轮播图样式 */
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
  height: 195px;
  border-radius: 10px;
}

/*消息提示*/
.myMessage {
  font-size: 22px;
  padding-left: 20px;
  margin-top: 5px;
}

.distance {
  text-align: right;
  float: right;
  font-size: 16px;
  line-height: 20px;
  color: rgb(153, 153, 179);
}

/* 门店标签css */
.keyword {
  color: rgb(8, 164, 236);
  background-color: rgb(191, 231, 249);
  margin-bottom: 5px;
  margin-right: 5px;
  font-size: 16px;
}

.storeName {
  font-size: 22px;
  font-weight: 600;
  padding: 0px;
}

.address>.van-cell__value--alone {
  font-size: 16px;
  color: rgb(153, 153, 179);
}

.address {
  padding: 0px;
}

.interval {
  margin-top: 5px;
}

#storeDetail {
  margin-top: 10px;
  border-top: 1px solid #EEEEEE;
  padding-bottom: 20px;
}

.weather {
  height: 80px;
  margin: 15px 10px 0;
}
</style>