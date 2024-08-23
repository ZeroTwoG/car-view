<template>
    <div>

        <!-- 头部刷新 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!--搜索框-->
            <van-row style="background: #ffffff">
                <van-col span="21">
                    <van-search v-model="address.storeName" shape="round" placeholder="请输入店铺搜索关键词" />
                </van-col>
                <van-col span="3" style="margin-top: 15px; text-align: left; font-size: 24px">
                    <van-icon name="search" @click="searchEss" />
                </van-col>
            </van-row>
            <!--轮播图-->
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(image) in images">
                    <img @click="jump('AA')" :src="image" style="height: 195px; width: 100%; border-radius: 7px" />
                </van-swipe-item>
            </van-swipe>
            <!--搜索条件框-->
            <div>
                <!-- 筛选框 -->
                <van-row>
                    <van-col :span="leng">
                        <van-cell readonly clickable :value="valueArea" @click="bindShow" style="font-size: 12px">{{
                            region }}<van-icon name="arrow-down" /></van-cell>
                        <!--选择省市区-->
                        <van-popup v-model="showArea" position="bottom" :style="{ height: '40%' }">
                            <van-area :area-list="areaList" cancel-button-text="重置" title="区域" @confirm="onAreaConfirm"
                                @cancel="bindCancel" :columns-num="2" />
                            <!-- :columns-num 3-省市区，2-省市，1-省 -->
                        </van-popup>
                    </van-col>
                    <van-col span="6">
                        <!-- 排序框 -->
                        <van-cell readonly clickable :value="valueSort" style="font-size: 12px" @click="bindSort">
                            {{ valueSort }}<van-icon name='arrow-down' />
                        </van-cell>

                        <!--选择排序顺序-->
                        <van-popup v-model="showSort" :lock-scroll="true" position="bottom" :style="{ height: '40%' }">
                            <van-area :area-list="SortList" title="门店排列顺序" @confirm="onSortConfirm" @cancel="SortCancel"
                                :columns-num="1" />
                        </van-popup>
                    </van-col>
                    <van-col span="6"></van-col>
                </van-row>

            </div>

            <!-- 门店信息模块 -->
            <div id="storeMsg" style="margin-bottom: 50px">
                <div v-for="item in store" @click="goStoreInfo(item.storeId, item.averageStar, item.storeDistance)">
                    <van-card :thumb="item.storeimage">
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
import { Toast } from "vant";
import { areaList } from "@vant/area-data";
import axios from "axios";

export default {
    data() {
        return {
            //搜索框默认区域
            region: '区域',
            //默认长度
            leng: 5,
            key: '0dcc39554278850fe01e5439bd55cea1',
            //选择的地址
            address: {
                storeName: '',
                province: "",
                city: "",
                rectangle: '',
            },
            valueSort: "距离优先", //列表默认排序方式
            valueArea: "请选择地区", //地区值
            //默认不出现选择地区列表
            showArea: false,
            //排序框默认不出现
            showSort: false,
            //显示列的数据
            areaList,
            // 排序属性
            SortList: {
                province_list: {
                    1: "距离优先",
                    2: "好评优先",
                },
            },
            isLoading: false, //刷新参数
            active: "search", //底部标签绑定
            images: [
                //轮播图
                require("../../assets/img/1.png"),
                require("../../assets/img/2.png"),
                require("../../assets/img/3.jpg"),
            ],
            store: [],
            //默认经纬度

        }
    },
    created() {

        this.getLocationInfo();

    },
    methods: {
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
            axios.get("http://172.16.7.55:7011/mainPage/store/selectStore", address).then(resp => {
                this.store = resp.data.data;
                //默认距离优先
                this.selectDistance();
            })
            this.address.storeName = '';


        },
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
        //选择地区
        bindShow() {
            this.showArea = true;
        },
        //确认选择此地区
        onAreaConfirm(val) {
            this.showArea = false;
            this.address.province = val[0].name
            this.address.city = val[1].name;
            this.region = val[0].name + " " + val[1].name;
            this.leng = this.region.length + 1;
            if (this.leng > 15) {
                this.leng = this.leng - 2;
            }
            if (this.leng > 17) {
                this.leng = this.leng - 1;
            }
            console.log(
                this.leng
            )
            this.getLocationInfo();
        },
        //重置该地区选项
        bindCancel() {
            this.valueArea = "请选择地区";
            this.address.province = ""
            this.address.city = ""
            this.getLocationInfo()
            this.leng = 5;
            this.region = "区域"
            this.showArea = false;
        },

        //排序方法 好评或距离优先
        bindSort() {
            this.showSort = true;
        },
        //根据星级评分进行显示
        selecrHeightStar() {
            //按照星级评分进行排序
            for (var i = 1; i < this.store.length; i++) {
                for (var j = 0; j < this.store.length - i; j++) {
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
        //距离优先
        selectDistance() {
            console.log("进来此方法")
            for (var i = 1; i < this.store.length; i++) {
                for (var j = 0; j < this.store.length - i; j++) {
                    // 比较距离的大小
                    if (this.store[j].storeDistance > this.store[j + 1].storeDistance) {
                        //交换位置
                        let tmp = this.store[j];
                        this.store[j] = this.store[j + 1];
                        this.store[j + 1] = tmp;
                    }
                }
            }
        },
        //确认选中的排序方式
        onSortConfirm(val) {
            console.log(val, "-----")
            this.valueSort = val[0].name;
            this.showSort = false;
            if (this.valueSort == "距离优先") {
                this.selectDistance();
            } else {
                //调用好评优先的方法
                this.selecrHeightStar();
            }
        },
        SortCancel() {
            this.showSort = false;
        },

        //搜索框的方法
        searchEss() {
            this.getLocationInfo();
            console.log(this.address.storeName)
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
        }
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

.interval {
    margin-top: 5px;
}

.min1 {
    background-color: #39a9ed;
    padding: 2px 8px 2px 1px;
    font-size: 16px;
    border-radius: 4px;
}

.min2 {
    background-color: #38ac83;
    padding: 2px 8px 2px 1px;
    font-size: 16px;
    border-radius: 4px;
}

.min3 {
    background-color: #df7007bb;
    padding: 2px 8px 2px 1px;
    font-size: 16px;
    border-radius: 4px;
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

.van-card {
    position: relative;
    box-sizing: border-box;
    padding: 8px 16px;
    color: #323233;
    font-size: 12px;
    background-color: white;
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
</style>