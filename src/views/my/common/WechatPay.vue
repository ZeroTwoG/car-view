<template>
    <div>
        <van-nav-bar style="height: 65px" title="支付方式" left-arrow @click-left="onClickLeft" />

        <div style="padding: 20px;">
            <van-row v-show="productOrder.totalAmount != 0 && productOrder.totalIntegral == 0">
                <van-col span="24">￥{{ productOrder.totalAmount }}</van-col>
            </van-row>
            <van-row v-show="productOrder.totalIntegral != 0 && productOrder.totalAmount == 0">
                <van-col span="24">{{ productOrder.totalIntegral }}积分</van-col>
            </van-row>
            <van-row v-show="productOrder.totalIntegral != 0 && productOrder.totalAmount != 0">
                <van-col span="24">￥{{ productOrder.totalAmount }}+{{ productOrder.totalIntegral }}积分</van-col>
            </van-row>
        </div>

        <div class="line" style="background-color: #f8f9f9; height: 6px;"></div>

        <van-row>
            <van-col class="choosePay">请选择支付方式</van-col>
        </van-row>

        <div class="line" style="background-color: #f8f9f9; height: 6px;"></div>

        <van-radio-group v-model="radio">
            <van-cell-group>
                <van-cell clickable @click="radio = '1'"
                    v-show="productOrder.totalAmount != 0 && productOrder.totalIntegral == 0">
                    <template #icon>
                        <van-image width="40px" height="40px" :src="require('@/assets/img/paylogo/WeChat.png')"
                            class="weixin-image" />
                    </template>
                    <template #title>
                        <div class="weixin-title">微信支付</div>
                    </template>

                    <template #right-icon>
                        <van-radio name="1" />
                    </template>
                </van-cell>

                <van-cell clickable @click="radio = '2'"
                    v-show="productOrder.totalAmount != 0 && productOrder.totalIntegral != 0">
                    <template #icon>
                        <van-image width="40px" height="40px" :src="require('@/assets/img/paylogo/WeChat.png')"
                            class="weixin-image" />
                    </template>
                    <template #title>
                        <div class="weixin-title">微信+积分支付</div>
                    </template>
                    <template #right-icon>
                        <van-radio name="2" />
                    </template>
                </van-cell>

                <van-cell clickable @click="radio = '3'"
                    v-show="productOrder.totalAmount == 0 && productOrder.totalIntegral != 0">
                    <template #title>
                        <div class="weixin-title">积分支付</div>
                    </template>
                    <template #right-icon>
                        <van-radio name="3" />
                    </template>
                </van-cell>

            </van-cell-group>
        </van-radio-group>


        <van-tabbar style="height: 13%; margin-top: 20px;">
            <van-col span="24">
                <van-button type="primary" class="btn" @click="pay">立即支付</van-button>
            </van-col>
        </van-tabbar>

        <van-dialog v-model="dialogVisible" title="支付界面" width="89%">
            <div style="text-align: center">
                <div style="padding: 20px;">
                    <van-row>
                        <van-col span="24" class="col-time" style="font-weight: bold;">
                            <span class="span">请在{{ formattedTime }}内支付，逾期订单将自动取消</span>
                        </van-col>
                    </van-row>
                </div>
                <p>微信支付 {{ productOrder.totalAmount }}元</p>
                <div style="border: 1px solid #f3f3f3; width: 250px; padding: 10px; margin: 0px auto">
                    <!--二维码支付模块-->
                    <vue-qr :text="this.payResult.codeUrl" :margin="0" colorLight="#fff" :size="200"
                        style="text-align: center">
                    </vue-qr>
                </div>
            </div>
            <div style="font-size: 13px">
                <van-cell :border="false" value="提示" />
                <van-cell :border="false">支付成功前请勿手动关闭页面</van-cell>
                <van-cell :border="false">二维码两小时内有效，请及时扫码支付</van-cell>
            </div>
        </van-dialog>
    </div>

</template>

<script>
import Vue from "vue";
import { Dialog, NavBar, Toast, } from "vant";
import vueQr from "vue-qr"
import QRCode from "qrcodejs2";
import axios from "axios";

Vue.use(NavBar);

export default {
    name: "WechatPay",
    props: {
        //注册属性，用来父子组件传递参数使用
    },
    data() {
        //定义数据的地方
        return {
            radio: "1",
            productOrderId: "",//订单id
            productOrder: {
                codeUrl: "",
            },//当前订单
            countdownTime: 30000,
            timer: null,//定时器 每隔一段时间检查支付状态
            code_url: "",//二维码路径
            paystatus: "",//支付状态
            payResult: {
                price: 0,
                codeUrl: "",
                orderNo: "",
            },
            orderNo: "",
            dialogVisible: false,
            timer1: "",
            paymentCompleted: false,
        };
    },
    created() {
        const dataParam = this.$route.query.data;
        if (dataParam) {
            const productOrderId = JSON.parse(dataParam);
            this.productOrderId = productOrderId;
        }
        this.queryByOrderId();
    },
    computed: {
        formattedTime() {
            // 将剩余时间格式化为时、分、秒
            const minutes = Math.floor((this.countdownTime % 3600000) / 60000);
            const seconds = Math.floor((this.countdownTime % 60000) / 1000);

            // 将格式化后的时间拼接为字符串
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            return `${formattedMinutes}:${formattedSeconds}`;
        },
    },
    methods: {
        // 返回上一级
        onClickLeft() {
            // go(-1): 返回上二级路由
            this.$router.go(-1);
        },
        // 查询订单
        queryByOrderId() {
            axios.get(`/my/productOrder/selectOneOrder?id=${this.productOrderId}`).then(response => {
                if (response.data.code === 200) {
                    this.productOrder = response.data.data; // 获取订单信息
                    this.orderNo = response.data.data.orderNo;
                } else {
                    console.log("查询订单发生错误");
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        // 获取支付的二维码信息
        pay() {
            if (this.radio === '1') {
                console.log(1);

                this.dialogVisible = true;

                // 清除之前的定时器
                if (this.timer1) {
                    clearInterval(this.timer1);
                    this.timer1 = null;
                }

                axios.post(`/my/productOrder/createWeChat/${this.orderNo}`).then(result => {
                    this.payResult.codeUrl = result.data.data.codeUrl;
                    if (result.data.code === 200 && this.dialogVisible) {
                        // 启动倒计时
                        this.startCountdown();
                        this.paymentCompleted = false;
                        // 设置一个定时任务，每隔3秒调用一次
                        this.timer1 = setInterval(() => {
                            this.queryPayStatus(this.orderNo);
                        }, 3000);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (this.radio === '2') {
                this.dialogVisible = true;

                // 清除之前的定时器
                if (this.timer1) {
                    clearInterval(this.timer1);
                    this.timer1 = null;
                }

                axios.post(`/my/productOrder/createWDPay`, this.productOrder).then(result => {
                    if (result.data.code === 200 && this.dialogVisible) {
                        // 启动倒计时
                        this.startCountdown();
                        this.payResult.codeUrl = result.data.data.codeUrl;
                        this.paymentCompleted = false;
                        // 设置一个定时任务，每隔3秒调用一次
                        this.timer1 = setInterval(() => {
                            this.queryWDPayStatus();
                        }, 3000);
                    } else if (result.data.code === 500) {
                        Toast.success("店铺积分不足！请充值");
                        this.$router.push({
                            path: '/unpaid?statusCode=1',
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            } else if (this.radio === '3') {
                Dialog.confirm({
                    title: "积分支付",
                    message: "确认要使用积分支付吗？",
                }).then(() => {
                    axios.post(`/my/productOrder/IntegralPay`, this.productOrder).then(response => {
                        if (response.data.code === 200) {
                            this.paymentCompleted = true;
                            Toast.success("积分支付成功！");
                            this.$router.push({
                                path: '/PayFinish',
                                query: {
                                    data: this.productOrderId,
                                }
                            });
                        } else {
                            Toast.fail("店铺积分不足！请充值获取", 3000, () => {
                                this.$router.push({
                                    path: '/unpaid?statusCode=1',
                                });
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });;
                }).catch(() => { });
            }
        },

        // 微信支付根据订单号查询支付状态
        queryPayStatus(orderNo) {
            if (orderNo !== "") {
                if (this.radio === '1') {
                    axios.post(`/my/productOrder/queryWeChatPayStatus/${this.orderNo}`).then(result => {
                        if (result.data.code === 200) {
                            this.paymentCompleted = true;
                            clearInterval(this.timer1);
                            this.timer1 = null;
                            Toast.success("支付成功");
                            this.dialogVisible = false;
                            this.$router.push({
                                path: '/PayFinish',
                                query: {
                                    data: this.productOrderId,
                                }
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });;
                }
            }
        },

        // 微信和积分支付根据订单号查询支付状态
        queryWDPayStatus() {
            axios.post(`/my/productOrder/queryWDPayStatus`, this.productOrder).then(result => {
                if (result.data.code === 200) {
                    this.paymentCompleted = true;
                    clearInterval(this.timer1);
                    this.timer1 = null;
                    Toast.success("支付成功");
                    this.dialogVisible = false;
                    this.$router.push({
                        path: '/PayFinish',
                        query: {
                            data: this.productOrderId,
                        }
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },

        startCountdown() {
            // 清除之前的定时器
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            // 更新倒计时时间
            this.timer = setInterval(() => {
                this.countdownTime -= 1000;
                if (this.countdownTime <= 0) {
                    this.paymentCompleted = true;
                    this.dialogVisible = false;
                    clearInterval(this.timer);
                    this.timer = null;
                    Toast.success("超时取消");
                    this.$router.push({
                        path: '/unpaid?statusCode=1',
                        query: {
                            data: this.productOrderId,
                        }
                    });
                }
            }, 1000);
        },
    },
    components: {
        vueQr,
        // 组件注册的地方 相当于pom文件
    },
}
</script>

<style scoped>
/* 导航栏css */
.van-nav-bar__title {
    font-size: 25px;
    font-weight: bold;
    margin-top: 20px;
}

/* 商品总价css */
.van-col {
    color: red;
    font-size: 25px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: -10px;
}

.col-time {
    font-size: 18px;
    color: black;
}

/* 分割线css */
.line {
    margin-top: 30px;
}

/*选择支付方式css */
.choosePay {
    color: black;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin-left: 15px;
    margin-top: 20px;
}

/* 微信支付css */
.weixin-image {
    width: 40px;
    height: 40px;
}

.weixin-title {
    display: grid;
    margin-top: 10px;
    margin-left: 10px;
}

/* 支付按钮css */
.btn {
    width: 100%;
    background-color: rgb(31, 164, 217);
    border: 0ch;
}
</style>