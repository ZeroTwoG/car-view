<template>
    <div id="storeDetail">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar title="门店详情" left-arrow @click-left="onClickLeft" />
            </van-sticky>
            <div>
                <van-row style="font-size: 14px;
                            padding-left: 15px;
padding-bottom: 15px;padding-top: 15px;background-color:#F7F7F7">
                    <van-col span="7">
                        余额：<span style="color: red">￥{{ amount }}</span>
                    </van-col>
                    <van-col span="6">
                        积分：<span style="color: red">{{ credits }}</span>
                    </van-col>
                </van-row>
            </div>
            <!--首页门店信息-->

            <div id="storeMsg" style="padding-top:10px;margin-bottom: 50px;margin-top: 1px">
                <div v-for="item in store" @click="goStoreInfo(item)">
                    <van-card :thumb="item.storeimage" style="background-color: white">
                        <template #tags>
                            <!--门店名称-->
                            <van-cell class="storeName" style="font-weight: normal;font-size: 20px;color: black">{{
                                item.storeName }}</van-cell>
                            <!--门店星级-->
                            <div class="interval">
                                <van-rate color="rgb(255, 167, 56)" v-model="item.averageStar" size="18px" allow-half
                                    readonly />
                                <!-- 门店距离 -->
                                <span class="distance">{{ item.storeDistance }}km</span>
                            </div>
                            <div class="interval">
                                <van-tag type="primary" size="medium">工位:&nbsp;&nbsp;{{ item.stationNumber }}</van-tag>
                                &nbsp;
                                <van-tag color="#00cc00" size="medium">空闲:&nbsp;&nbsp;{{ item.stationIdle }}</van-tag>
                                &nbsp;
                                <van-tag color="#FFA500" size="medium" v-if="item.stationUsed != 0">使用中:&nbsp;&nbsp;{{
                                    item.stationUsed }}</van-tag>
                            </div>
                            <!-- 门店标签 -->
                            <div class="interval">
                                <van-tag class="keyword" v-for="(item1, index) in item.storeLabel" :key="index"
                                    :list="item1.storeLabel">{{ item1 }}</van-tag>&nbsp;
                            </div>
                            <!-- 门店地址 -->
                            <van-cell class="address">
                                <van-icon name="location" color="skyblue" />
                                {{ item.address }}</van-cell>
                        </template>
                    </van-card>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data() {
        return {
            isLoading: false, //刷新参数
            //选择的地址
            address: {
                storeName: '',
                province: "",
                city: "",
                rectangle: '',
                storeId: ''
            },
            key: '0dcc39554278850fe01e5439bd55cea1',
            amount: 0,//默认金额
            credits: 0,//默认积分
            store: [],
        }
    },
    created() {
        this.address.storeId = this.$route.query.storeId;
        this.amount = this.$route.query.amount;
        this.credits = this.$route.query.credits;
        this.getLocationInfo();
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
                    // console.log(_this.data1,"--------")
                    _this.loadAllStore(_this.address);
                    // console.log(_this.address.rectangle)
                });
        },
        //加载所有店铺信息
        loadAllStore(address) {
            let xyxs = sessionStorage.getItem("place");
            axios.post("/my/store/selectDetailStore?rectangle=" + xyxs + "" + "&storeId=" + address.storeId).then(resp => {
                this.store = resp.data.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        //点击店铺跳转
        goStoreInfo(date) {
            this.$router.push({
                path: "/StoreInformation",
                query: {
                    storeId: date.storeId,
                    averageStar: date.averageStar,
                    storeDistance: date.storeDistance,
                    address: date.longitude + "," + date.latitude + "",
                },
            });
        },

    }
}
</script>
<style scoped>
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

#storeMsg {
    margin-top: 10px;
    border-top: 1px solid #EEEEEE;
    padding-bottom: 15px;
    border-bottom: 1px solid #EEEEEE;
}

.interval {
    margin-top: 5px;
}
</style>