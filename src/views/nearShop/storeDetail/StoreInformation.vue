<template>
    <div id="detail">
        <!-- 头部刷新 -->
        <div style="z-index: 1">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <!-- 粘性布局 -->
                <van-sticky>
                    <!-- 导航栏 -->
                    <van-nav-bar title="门店详情" left-arrow @click-left="onClickLeft" />
                    <!-- 标题 -->
                </van-sticky>

                <!-- 门店轮播图 -->
                <div v-if="storeStation.length <= 0">
                    <img src="https://img01.yzcdn.cn/vant/apple-1.jpg"
                        style="height: 402px; width: 100%; border-radius: 7px" />
                </div>
                <div v-else>
                    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                        <van-swipe-item v-for="image in storeStation" :key="image.station">
                            <img :src="image.picture" style="height: 402px; width: 100%; border-radius: 7px" />
                        </van-swipe-item>
                    </van-swipe>
                </div>
                <!-- 中间的空白部分 -->
                <van-row style="height: 8px; background-color: #ffffff">
                    <van-col span="24"></van-col>
                </van-row>
                <van-row style="margin-top: 3px">
                    <van-col span="16" style="
              font-size: 18px;
              text-align: left;
              padding-left: 10px;
              font-weight: 700;
            ">
                        <!-- 门店名称 -->
                        {{ store.storeName }}
                    </van-col>

                    <van-col span="8">
                        <a style="
                text-decoration: none;
                font-weight: bold;
                font-size: 18px;
                color: #019FE8;
              ">工商登记信息</a>
                    </van-col>
                </van-row>
                <van-row style="margin-top: 15px">
                    <!-- 门店位置 -->
                    <van-col style="text-align: left; margin-left: 10px; margin-bottom: 10px" span="20">
                        <van-icon name="location" color="#019FE8" />
                        &nbsp;{{ store.address }}距您({{ storeDistance }})公里
                    </van-col>
                </van-row>
                <hr />
                <van-row style="margin-top: 15px; font-size: 16px">
                    <van-col span="9" style="text-align: left; margin-left: 16px">
                        &nbsp;营业时间&nbsp;&nbsp;24小时
                    </van-col>
                    <van-col span="7"></van-col>

                    <van-col style="color: aqua; font-weight: normal; font-size: 18px" span="6">
                        <!-- to="index" 路由跳转 -->
                        <van-button type="default" style="height: 24px; float: right">
                            申报故障
                        </van-button>
                    </van-col>
                </van-row>
                <van-row style="margin-top: 10px; margin-bottom: 15px; font-size: 16px">
                    <van-col style="text-align: left; margin-left: 20px" span="24">门店评分&nbsp;&nbsp;<van-rate allow-half
                            v-model="averageStar" readonly color="rgb(255, 167, 56)" />
                    </van-col>
                </van-row>
                <hr />
                <!-- 洗车工位 -->
                <van-row style="margin-top: 15px; margin-bottom: 10px;margin-left: 8px">
                    <van-col span="5" style="font-weight: normal; font-size: 16px; margin-left: 10px;">
                        洗车工位
                    </van-col>
                    <van-col span="12"></van-col>
                    <van-col span="6">
                        <!-- 导航栏 -->
                        <a @click="checkedStation(storeId)" style="text-decoration: none; color: #019FE8">查看全部</a>
                        <van-icon name="arrow" color="blue" />
                    </van-col>
                </van-row>
                <!-- 洗车工位信息 -->
                <van-row>
                    <van-col span="15">
                        <van-card v-for="item in storeStation" :key="item.station" :thumb="item.picture"
                            style="text-align: left; font-size: 15px;padding-bottom: 20px;background-color: white">
                            <template #tags>
                                <!-- 工位名称 -->
                                <van-cell class="stationName"
                                    style="font-size: 16px;margin-top: -10px;margin-left: -5px; ">
                                    {{ item.stationName }}
                                </van-cell>
                                <div class="interval" style="padding-left: 10px" v-if="item.idle <= 0">
                                    <van-tag class="min2" type="medium" size="medium">空闲中
                                    </van-tag>
                                    <div style="padding-top: 5px; text-algin: left; font-size: 13px;width: 150px">
                                        无需等待，可立即洗车
                                    </div>
                                </div>

                                <div class="interval" style="padding-left: 10px" v-else>
                                    <van-tag class="min3" type="medium" size="large">使用中
                                    </van-tag>
                                    <div style="padding-top: 10px; font-size: 13px">
                                        请耐心等待
                                    </div>
                                </div>
                            </template>
                        </van-card>
                    </van-col>
                </van-row>
                <hr />
                <!-- 门店商品 -->
                <van-row style="
            margin-top: 10px;
            margin-bottom: 10px;
            height: 36px;
            line-height: 36px;
            margin-left: 10px;
          ">
                    <van-col span="5" style="font-weight: normal; font-size: 16px; margin-left: 10px">
                        门店商品
                    </van-col>
                    <van-col span="12"></van-col>
                    <van-col span="6">
                        <!-- 导航栏 -->
                        <a @click="shop(storeId, store.storeName, store.storeimage)"
                            style="text-decoration: none; color: #019FE8">查看全部</a>
                        <van-icon name="arrow" color="blue" />
                    </van-col>
                </van-row>
                <hr />
                <!-- 门店评价 -->
                <div>
                    <van-row style="
                    margin-top: 10px;
                    margin-bottom: 10px;
                    height: 36px;
                    line-height: 36px;
                    margin-left: 10px;
                    ">
                        <van-col span="5" style="font-weight: normal; font-size: 16px;margin-left: 10px">
                            门店评价
                        </van-col>
                        <van-col span="12"></van-col>
                        <van-col span="6">
                            <!-- 导航栏 -->
                            <a @click="evaluateDetail(storeId)" style="text-decoration: none; color: #019FE8">查看全部</a>
                            <van-icon name="arrow" color="blue" />
                        </van-col>
                    </van-row>
                    <div v-for="(item, index) in storeEvaluate" :key="index" v-if="index < 2">
                        <van-row style="margin-top: 20px; font-size: 12px">
                            <van-col span="4">
                                <van-image round width="2rem" height="2rem" :src="item.avatar"
                                    style="margin-left: 25px" />
                            </van-col>
                            <van-col span="14">
                                <van-row>
                                    {{ item.userName }}
                                </van-row>
                                <van-row>
                                    <van-rate size="10px" allow-half v-model="item.star" readonly
                                        color="rgb(255, 167, 56)" />
                                </van-row>
                            </van-col>
                            <van-col span="4" style="color: #999">
                                {{ item.evaluateTime }}
                            </van-col>
                        </van-row>
                        <van-row style="margin-left: 30px;margin-top: 10px;padding-bottom:5px">
                            <van-col span="20">
                                {{ item.content }}
                            </van-col>
                        </van-row>
                        <van-row style="margin-left: 30px">
                            <van-image style="width: 120px;height: 120px"
                                v-if="item.picture !== '' & item.picture != null" :src="item.picture"></van-image>
                        </van-row>
                    </div>
                </div>
                <hr />

                <!-- 路线 -->
                <div style="padding-bottom:20px ">
                    <van-row style="margin-top: 3px">
                        <van-col span="8" style="
              text-align: left;
              margin-left: 20px;
              font-weight: normal;
              font-size: 16px;
              margin-bottom: 5px;
              margin-top: 10px;
              float: left;
              width: 100%;
            ">
                            路线
                        </van-col>
                        <van-col span="8"></van-col>
                        <van-col
                            style="color: aqua; font-weight: normal; font-size: 18px;float: left;width: 100%;padding: 14px"
                            span="8">
                            <!--                         ==================================================================================-->
                            <BDMap :xy="xys"></BDMap>
                        </van-col>
                    </van-row>
                    <van-row style="margin-top: 10px;margin-left: 10px">
                        <van-col style="
              text-align: left;
              margin-bottom: 10px;
              margin-left: 10px;
           " span="20">
                            {{ store.address }}
                        </van-col>
                    </van-row>
                </div>
                <hr />
                <!--悬浮图片-->
                <div class="container">
                    <img id="floatingImage" src="@/assets/img/carLogo/add1.png" alt="Floating Image"
                        @click="bingCar(storeId)">
                </div>
                <!-- 客流量分析 -->
                <van-row style="margin-top: 3px">
                    <van-col span="8" style="
              text-align: left;
              margin-left: 20px;
              font-weight: normal;
              font-size: 16px;
              margin-bottom: 5px;
              margin-top: 10px;
            ">客流量分析 </van-col>
                    <van-col span="8"></van-col>

                </van-row>
                <van-row style="margin-top: 15px">
                    <van-col style="text-align: left; margin-left: 20px" span="20">
                        避开洗车高峰，无需排队，减少碳排放
                    </van-col>
                </van-row>
                <van-row>
                    <van-col> <br /></van-col>
                </van-row>
                <!--  统计图 -->
                <div id="main" style="height: 350px; width: 450px"></div>

                <van-row style="height: 36px; background-color: #ffffff">
                    <van-col span="5"> </van-col>
                    <van-col span="1"></van-col>
                    <van-col span="9"></van-col>
                    <van-col span="1"></van-col>
                    <van-col span="4"></van-col>
                    <van-col span="4"></van-col>
                </van-row>
                <!--底部标签-->
                <van-tabbar v-model="active" style="height: 70px" active-color="#646566">
                    <van-tabbar-item icon="phone" @click="relate(store.phone)">
                        联系店长
                    </van-tabbar-item>
                    <van-tabbar-item>
                        <van-button
                            style="font-size: 14px;margin-top:5px;background-color: #019FE8;color:white;border-radius: 10px;"
                            @click="recharge">
                            <van-icon name="card" size="2em" color="#ffffff" /><span
                                style="position: relative;top: -7px;left: 4px">充值洗车</span></van-button>
                    </van-tabbar-item>
                    <van-tabbar-item icon="guide-o" @click="storeMap(store)">
                        位置信息
                    </van-tabbar-item>
                </van-tabbar>
            </van-pull-refresh>
        </div>
    </div>
</template>
<script>
import { Toast } from "vant";
import * as echarts from "echarts";
import axios from "axios";
import BDMap from "@/views/map/Map.vue"

export default {
    components: {
        BDMap: BDMap
    },
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data() {
        return {
            xys: "",
            xyy: "",
            active: "search",
            isLoading: false, //刷新参数
            storeId: "",
            store: [],
            storeEvaluate: [],
            storeStation: [],
            averageStar: 0,//门店评分
            storeDistance: 0,//门店距离
            //echarts表数据
            dataList: [],
            xList: [], //定义x轴数据集合
            userNumberList: [], //Y轴数据
            userNumber: "", //用户的注册数量
            washCarName: "洗车数",
            washMsg: "近七天用户洗车统计图",
            userId: '',
            //查看是否绑定门店
            bindStore: false,
            //用于绑定门店
            frontUserStore: {
                userId: '',
                storeId: ''
            },
            product: {
                storeId: '',
                storeName: '',
            }
        }
    },
    created() {
        const userDataStr = sessionStorage.getItem("user");
        const userData = JSON.parse(userDataStr);
        this.userId = userData.userId
        this.storeId = this.$route.query.storeId;
        this.xys = this.$route.query.address
        this.averageStar = parseFloat(this.$route.query.averageStar);
        this.storeDistance = parseFloat(this.$route.query.storeDistance);
        this.selectStore(this.storeId);
        this.selectStoreEvaluate(this.storeId);
        this.selectStoreStation(this.storeId);
        //执行方法 获取echarts图表需要的数据
        this.selectUserNumber();
        this.checkedBind();
    },
    mounted() {
        this.myEcharts();
    },
    methods: {
        //跳转地图
        storeMap(data) {
            this.$router.push({
                path: "/mapAll",
                query: { storeName: data.storeName, address: data.address, xs: data.longitude, ys: data.latitude },
            });
        },
        //查看是否绑定门店
        checkedBind() {
            axios.post("/nearShop/frontUserStore/selectFrontUser?storeId=" + this.storeId + "&userId=" + this.userId).then(resp => {
                if (resp.data.code === 200) {
                    this.bindStore = true;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        //绑定车辆
        bingCar(storeId) {
            this.$router.push({
                path: "/BindCar",
                query: {
                    storeId: storeId,
                },
            });
        },

        //获取参数
        selectUserNumber() {
            let _this = this;
            //使用axios向后台发请求
            axios.get("/nearShop/carWashRecord/selectRecord?storeId=" + this.storeId)
                .then(function (response) {
                    if (response.data.data.length == 0) {
                        _this.washMsg = "暂无洗车数据"
                    }
                    if (response.data.code == 200) {
                        _this.dataList = response.data.data;
                        // 添加数据到每个集合中
                        for (let i = 0; i < _this.dataList.length; i++) {
                            //月份  （X轴数据）
                            _this.xList.push(_this.dataList[i].timePeriod);
                            //注册量 （Y轴数据）
                            _this.userNumberList.push(_this.dataList[i].recordCount);
                        }
                        //调用显示方法
                        _this.myEcharts();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //充值洗车
        recharge() {
            this.$router.push({
                path: "/Payment",
                query: {
                    storeId: this.storeId
                },
            });

        },
        //echarts图表相关方法
        myEcharts() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById("main"));

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.washMsg,
                    textStyle: {
                        fontSize: 16,         // 标题字体大小
                        fontWeight: "normal",   // 标题字体粗细
                        marginLeft: 20
                    },
                    left: '15px', // 调整这个值来改变标题向左的偏移量
                },
                tooltip: {},
                legend: {
                    data: ["洗车数"],
                },
                // x轴显示的内容
                xAxis: {
                    data: this.xList,
                },
                yAxis: {},
                series: [
                    {
                        name: this.washCarName,
                        type: 'line',
                        data: this.userNumberList,
                        barWidth: "20%",
                    },
                ],
                grid: {
                    right: '30%', // 调整这个值来改变图表向左的偏移量
                },
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        //联系店长
        relate(phone) {
            this.$dialog
                .confirm({
                    title: "提示",
                    message: "是否要拨打" + phone,
                    confirmButtonColor: "red",
                })
                .then(() => {
                    console.log("确认");
                })
                .catch(() => {
                    console.log("取消");
                });
        },
        //刷新方法
        onRefresh() {
            setTimeout(() => {
                Toast("刷新成功");
                this.isLoading = false;
                //调用请求
            }, 1000);
        },
        //通过storeId查店铺
        selectStore(storeId) {
            axios.post("/nearShop/store/selectByStoreId?storeId=" + storeId).then(resp => {
                this.store = resp.data.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        //通过storeId查询评分
        selectStoreEvaluate(storeId) {
            axios.post("/nearShop/storeEvaluate/selectCommentsVoByStoreId?storeId=" + storeId).then(resp => {
                if (resp.data.code != 500) {
                    this.storeEvaluate = resp.data.data;
                } else {
                    // this.$toast("暂无评分");
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        //通过storeId查询工位
        selectStoreStation(storeId) {
            axios.post("/nearShop/station/selectByStoreId?storeId=" + storeId).then(resp => {
                this.storeStation = resp.data.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        //详细评论跳转
        evaluateDetail(storeId) {
            if (this.bindStore) {
                this.$router.push({
                    path: "/EvaluateDetail",
                    query: { storeId: storeId },
                });
            } else {
                this.$dialog
                    .confirm({
                        title: "提示",
                        message: "您暂未和店铺绑定，是否绑定当前店铺",
                        confirmButtonColor: "red",
                    })
                    .then(() => {
                        this.bingStoreMsg();
                        this.checkedBind();
                        console.log("确认");
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            }
        },
        //绑定门店信息
        bingStoreMsg() {
            axios.post("/nearShop/frontUserStore/insertFrontUser?userId=" + this.userId + "&storeId=" + this.storeId).then(resp => {
                if (resp.data.code == 200) {
                    this.bindStore = true;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        //跳转商店
        shop(storeId, storeName, storeimage) {
            this.product.storeId = storeId;
            this.product.storeName = storeName
            this.product.storeimage = storeimage;
            this.product.averageStar = this.averageStar;
            this.$router.push({
                path: "/StoreCheck",
                query: {
                    data: JSON.stringify(this.product)
                },
            });
        },
        //工位详细信息
        checkedStation(storeId) {
            if (this.bindStore) {
                this.$router.push({
                    path: "/StationDetail",
                    query: { storeId: storeId },
                });
            } else {
                this.$dialog
                    .confirm({
                        title: "提示",
                        message: "您暂未和店铺绑定，是否绑定当前店铺",
                        confirmButtonColor: "red",
                    })
                    .then(() => {
                        this.bingStoreMsg();
                        this.checkedBind();
                        console.log("确认");
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            }
        }

    }
}
</script>
<style scoped>
.interval {
    margin-top: 5px;
}

.min2 {
    background-color: #00cc00;
    padding: 2px 5px 2px 5px;
    font-size: 14px;
    border-radius: 4px;
}

.min3 {
    background-color: #FFA500;
    padding: 2px 5px 2px 5px;
    font-size: 14px;
    border-radius: 4px;
}

.container {
    position: fixed;
    bottom: 120px;
    /* 调整图片与底部的距离 */
    right: 10px;
    /* 调整图片与右侧的距离 */
    width: 50px;
    height: 50px;
    z-index: 9999;
    transition: all 0.3s ease-in-out;
}

#floatingImage {
    width: 50px;
    height: 50px;
}

/* 轮播图样式 */
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
    height: 402px;
    border-radius: 10px;
}

hr {
    /*color: #999;*/
    background-color: #F6F7F9;
    height: 8px;
    border: none;
}
</style>
