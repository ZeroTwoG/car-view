<template>
    <div id="stationDetail">
        <div style="z-index: 1">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <!-- 粘性布局 -->
                <van-sticky>
                    <!-- 导航栏 -->
                    <van-nav-bar title="工位信息" left-arrow @click-left="onClickLeft" />
                </van-sticky>

                <van-row>
                    <van-col span="15">
                        <van-card v-for="item in storeStation" :key="item.station" :thumb="item.picture"
                            style="text-align: left; font-size: 15px;background-color: white">
                            <template #tags>
                                <!-- 工位名称 -->
                                <van-cell class="stationName"
                                    style="font-size: 16px;margin-top: -10px;margin-left: -5px; ">
                                    {{ item.stationName }}
                                </van-cell>
                                <div class="interval" style="padding-left: 10px" v-if="item.idle <= 0">
                                    <div style="width: 140px ;">
                                        <div style="float: left;width: 60px;">
                                            <van-tag class="min2" type="medium" size="medium">空闲中
                                            </van-tag>
                                        </div>
                                        <div style="width:70px;float: right;">
                                            <van-tag class="min4" type="medium" size="medium"
                                                @click="washCar(item.station)">立即洗车
                                            </van-tag>
                                        </div>
                                    </div>
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
            </van-pull-refresh>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

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
            storeId: '',
            storeStation: [],
            storeBindDetail: []
        }
    },
    created() {
        const userDataStr = sessionStorage.getItem("user");
        const userData = JSON.parse(userDataStr);
        this.userId = userData.userId
        this.storeId = this.$route.query.storeId;
        this.selectStoreStation(this.storeId);
        this.storeBindMsg();
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
        //通过storeId查询工位
        selectStoreStation(storeId) {
            axios.post("/nearShop/station/selectByStoreId?storeId=" + storeId).then(resp => {
                this.storeStation = resp.data.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        //洗车
        washCar(stationId) {
            if (this.storeBindDetail[0].amount < 10) {
                this.$dialog
                    .confirm({
                        title: "提示",
                        message: "您的余额不足十元，是否立即充值",
                        confirmButtonColor: "red",
                    })
                    .then(() => {
                        this.$router.push({
                            path: "/Payment",
                            query: {
                                storeId: this.storeId
                            },
                        });
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            } else {
                console.log("够钱")
                this.$router.push({
                    path: "/BindCarOfStore",
                    query: { storeId: this.storeId, userId: this.userId, stationId: stationId },
                });
            }
        },
        storeBindMsg() {
            axios.post("/nearShop/userBalance/selectStoreBind?userId=" + this.userId + "&storeId=" + this.storeId).then(resp => {
                if (resp.data.code === 200) {
                    this.storeBindDetail = resp.data.data;
                    this.storeBindDetail = this.storeBindDetail.filter(item => {
                        if (item.amount == null) {
                            item.amount = "0.00"
                        }
                        return item.storeId == this.storeId;
                    });
                } else {
                    this.$dialog.alert({
                        title: "提示",
                        message: "余额不足十元，请充值后再试",
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
    }
}
</script>
<style scoped>
.min2 {
    background-color: #00cc00;
    padding: 2px 5px 2px 5px;
    font-size: 14px;
    border-radius: 4px;
}

.min4 {
    background-color: #6A8BFA;
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

.interval {
    margin-top: 5px;
}
</style>