<template>
    <div id="storeBind">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar title="绑定的门店" left-arrow @click-left="onClickLeft" />
            </van-sticky>
            <div v-for="item in storeBindDetail" style="padding-bottom: 20px;
                 padding-top: 20px;
                 border-bottom: 1px solid #EEEEEE;
                  margin-left: 15px;margin-right: 15px;">
                <van-row style="padding-bottom: 10px">
                    <van-col span="19">
                        {{ item.storeName }}
                    </van-col>
                    <van-col span="5" style="font-size: 14px"
                        @click="checkedStore(item.amount, item.credits, item.storeId)">查看门店<van-icon
                            name="arrow" /></van-col>
                </van-row>
                <van-row style="font-size: 14px">
                    <van-col span="7">
                        余额：<span style="color: red">￥{{ item.amount }}</span>
                    </van-col>
                    <van-col span="6">
                        积分：<span style="color: red">{{ item.credits }}</span>
                    </van-col>
                </van-row>
            </div>
        </van-pull-refresh>
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
            userId: '',
            storeBindDetail: [],
        }
    },
    created() {
        const userDataStr = sessionStorage.getItem("user");
        const userData = JSON.parse(userDataStr);
        this.userId = userData.userId
        this.storeBindMsg()
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
        storeBindMsg() {
            axios.post("/my/userBalance/selectStoreBind?userId=" + this.userId).then(resp => {
                this.storeBindDetail = resp.data.data;
                this.storeBindDetail.forEach(item => {
                    if (item.amount == null) {
                        item.amount = "0.00"
                    }
                    if (item.credits == null) {
                        item.credits = 0
                    }
                })
            }).catch(function (error) {
                console.log(error);
            });
        },
        //查看门店
        checkedStore(amount, credits, storeId) {
            this.$router.push({
                path: "/StoreDetail",
                query: { amount: amount, credits: credits, storeId: storeId },
            });
        }
    }
}
</script>