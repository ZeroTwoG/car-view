<template>
  <div>
    <van-sticky>
      <van-nav-bar title="绑定门店" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <!-- 门店信息模块 -->
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
              <van-tag color="#FFA500" size="medium" v-if="item.stationUsed != 0">使用中:&nbsp;&nbsp;{{ item.stationUsed }}
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
</template>
<script>
import axios from 'axios';

export default {
  name: "CarBindStore",
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      carNo: "",
      //选择的地址
      address: {
        storeName: '',
        province: "",
        city: "",
        rectangle: '',
        carId: 0,
      },
      store: [],
      key: '0dcc39554278850fe01e5439bd55cea1',
    }
  },
  created() {
    this.getLocationInfo();
  },
  methods: {
    loadAllStore() {
      this.address.carId = this.$route.query.carId;
      //加载所有店铺信息
      axios.post("/mainPage/store/selectDetailStore/" + this.address.carId).then(resp => {
        this.store = resp.data.data;
      })
      this.selectHeightStar();
      this.address.storeName = '';
    },
    //根据星级评分进行显示
    selectHeightStar() {
      //按照星级评分进行排序
      for (let i = 1; i < this.store.length; i++) {
        for (let j = 0; j < this.store.length - i; j++) {
          // 比较评分的大小
          if (
            this.store[j].averageStar <
            this.store[j + 1].averageStar
          ) {
            //交换位置
            let tmp = this.store[j];
            this.store[j] = this.store[j + 1];
            this.store[j + 1] = tmp;
          }
        }
      }
    },
    //点击店铺跳转
    goStoreInfo(storeId, averageStar, storeDistance) {
      this.$router.push({
        path: "/StoreInformation",
        query: {
          storeId: storeId,
          averageStar: averageStar,
          storeDistance: storeDistance
        },
      });
    },
    // 获取用户位置信息
    async getLocationInfo() {
      fetch("https://restapi.amap.com/v3/ip?key=" + this.key).then((res => {
        return res.text();
      })).then((myJson => {
        this.temp = JSON.parse(myJson); //把json字符串转为json数组
        this.address.rectangle = this.temp.rectangle; //获取当前位置的经纬度
        this.loadAllStore();
      }))
    },
  }
}
</script>
<style scoped>
.interval {
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
  padding: 0;
}

.address>.van-cell__value--alone {
  font-size: 16px;
  color: rgb(153, 153, 179);
}

.address {
  padding: 0;
}
</style>