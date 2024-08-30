<template>
    <div>
        <van-sticky>
            <van-nav-bar title="支付结果" left-arrow @click-left="onClickLeft" />
        </van-sticky>
        <div style="height: 120px">
            <!-- 金额 -->
            <van-row>
                <van-col span="24"
                    style="  color: red;font-size: 25px;font-weight: bold; margin-top: 30px;margin-bottom: -10px;">支付成功！
                </van-col>
            </van-row>

            <!-- 剩余支付时间 -->
            <van-row>
                <van-col span="24" class="col-time"
                    style="font-weight: bold;margin-top: 30px;margin-bottom: -10px;"><span class="span">{{ formattedTime
                        }}</span>秒后返回主页面
                </van-col>
            </van-row>
        </div>

        <div class="line" style="background-color: #f8f9f9; height: 6px; margin-top: 20px"></div>

        <van-row>
            <van-col class="choosePay">商品详情</van-col>
        </van-row>
        <div class="line" style="background-color: #f8f9f9; height: 6px; margin-top: 20px"></div>
        <div style="margin-top: 25px">
            <van-row>
                <!--                //图片显示-->
                <van-col span="2" style="margin-left: 6px">
                    <van-image width="100" height="100" radius="5px" :src='productOrder[0].picture' />
                </van-col>

                <van-col span="18" style="margin-left: 3px">
                    <!--商品名称-->
                    <div class="productNameBox">{{ productOrder[0].productName }}</div>
                    <div style="height: 57px"></div>

                    <!-- 商品现价 -->
                    <span style="font-size: 22px; color: red; margin-left: 10px;" class="productNameBox">
                        {{ productOrder[0].newPrice }}
                    </span>

                    <!-- 商品原价 -->
                    <span style="color: gray; text-decoration: line-through; margin-left: 10px;">
                        ￥{{ productOrder[0].loadPrice }}
                    </span>

                    <!-- 积分 -->
                    <span style="font-size: 22px; color: red; left: 50px;margin-left: 20px"
                        v-show="productOrder[0].integral != 0" class="productNameBox">+{{ productOrder[0].integral }}积分
                    </span>

                </van-col>

                <!--                //商品个数-->
                <van-col span="2" style="margin-right: 1px">
                    <div style="height: 80px"></div>
                    x{{ productOrder[0].productCount }}
                </van-col>
            </van-row>
        </div>
        <van-row style="margin-top: 15px; text-align: right; color: red; font-weight: bold; margin-right: 20px">
            <van-col span="24">
                实付款: ￥{{ productOrder[0].totalAmount }}
            </van-col>
        </van-row>
        <div class="line" style="background-color: #f8f9f9; height: 6px; margin-top: 20px"></div>


        <!-- 支付按钮 -->
        <!-- 底部 -->
        <van-tabbar style="height: 13%; margin-bottom: 20px">
            <van-col span="24">
                <van-button round type="info" class="btn" @click="goMyOrder">返回主页
                </van-button>
            </van-col>
        </van-tabbar>
    </div>


</template>

<script>
import Vue from "vue";
import { NavBar } from "vant";
import axios from "axios";

Vue.use(NavBar);
export default {
    name: "PayFinish",
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data() {
        //定义数据的地方
        return {
            price: 0, //商品价格
            time: "", //剩余支付时间
            radio: "1",
            product: {},
            freight: "", //给运费信息赋值
            price: "", //商品价格
            priceValue: "", //商品积分和商品价格中间的字
            integral: "", //商品积分
            totalAmount: '', //商品个数
            countdownTime: 10000, // 倒计时时间为3秒
            //商品信息
            productOrder: {},
            timer: "",//定时器
        };
    },
    computed: {
        formattedTime() {
            // 将剩余时间格式化为时、分、秒
            const hours = Math.floor(this.countdownTime / 3600000);
            const minutes = Math.floor((this.countdownTime % 3600000) / 60000);
            const seconds = Math.floor((this.countdownTime % 60000) / 1000);

            // 将格式化后的时间拼接为字符串
            const formattedHours = String(hours).padStart(2, "0");
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        },
    },
    created() {
        this.productOrderId = this.$route.query.data;
        this.queryByOrderId(this.productOrderId)
    },
    methods: {
        startCountdown() {
            // 更新倒计时时间
            this.timer = setInterval(() => {
                this.countdownTime -= 1000;
                if (this.countdownTime <= 0) {
                    clearInterval(this.timer);
                    this.redirectToAnotherPage();
                }
            }, 1000);
        },
        redirectToAnotherPage() {
            this.goMyOrder();
        },
        goMyOrder() {
            this.$router.push("/unpaid?statusCode=1");
            clearInterval(this.timer);
        },
        //查询订单
        queryByOrderId() {
            axios.get("/my/productOrder/PayFinish?id=" + this.productOrderId).then((response => {
                if (response.data.code == 200) {
                    if (response.data.data != null || response.data.data != '') {
                        this.productOrder = response.data.data; //获取订单信息
                        if (this.productOrder[0].isFreightShipping == 0) {
                            this.freight = "免运费,部分地区不包邮";
                        } else if (this.productOrder[0].isFreightShipping == 1) {
                            this.freight = this.productOrder.freight + "元";
                        }
                        //判断积分是否启用
                        if (this.productOrder[0].integralEnabled == 0) {
                            //积分启用 如果设置现价，就显示积分加现价
                            if (this.productOrder[0].newPrice > 0) {
                                this.integral = this.productOrder[0].integral;
                                this.priceValue = "积分+￥";
                                this.price = this.productOrder[0].newPrice;
                            } else {
                                this.integral = this.productOrder[0].integral;
                                this.priceValue = "积分 ";
                            }
                        } else {
                            this.price = this.productOrder[0].newPrice;
                            this.priceValue = "￥";
                        }

                    } else {
                        console.log("查询订单发生错误")
                    }
                }


            }))
        },
    },

}

</script>

<style scoped>
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

/* 支付按钮css */
.btn {
    width: 100%;
    background-color: rgb(31, 164, 217);
    border: 0ch;
}

.productNameBox {
    position: relative;
    left: 112px;
    text-align: left;
    width: 200px;
}
</style>