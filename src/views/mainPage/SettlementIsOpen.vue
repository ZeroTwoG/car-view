<template>
    <!-- 书写html结构 -->
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="洗车详情" left-text="返回" left-arrow @click-left="jump('SelectARecord')" />

        <van-cell-group inset style="text-align: left">
            <van-cell title="门店" v-model="store.storeName" value="store.storeName" />
            <hr />
            <van-cell title="车牌号" v-model="orderMsg.carNo" :value="orderMsg.carNo" />
            <hr />
            <van-cell title="消费时长" v-model="userTime" :value="userTime" />
            <hr />
            <van-cell title="进场时间" v-model="orderMsg.startTime" :value="orderMsg.startTime" />
            <hr />
        </van-cell-group>

        <br />
        <van-row style="margin-left: 30px; font-size: 15px">
            <van-col span="7">选择洗车券</van-col>
            <van-col span="8"></van-col>
            <van-col span="8" @click="chooseCarTicket">{{ couponName }}
                <van-icon name="arrow" />
            </van-col>
        </van-row>

        <br />
        <van-row style="margin-left: 18px; margin-right: 18px">
            <van-col span="24">
                <hr />
            </van-col>
        </van-row>
        <br />
        <van-row>
            <van-col span="24"
                style="color: red; text-align: left; padding-left: 30px;padding-right: 20px">*倒车即可识别结算开门，未能识别再进行手动结算
            </van-col>
        </van-row>
        <br />
        <van-row>
            <van-col span="24" style="color: red; text-align: left; padding-left: 30px">*开门后30秒落门，请即立场！
            </van-col>
        </van-row>
        <br />
        <van-button round type="info" style="margin-top: 10px; width: 100%" @click="settlememnt">结算</van-button>
    </div>
</template>

<script>
import moment from "moment";
import Vue from "vue";
import { Dialog, Toast } from "vant";
import axios from "axios";
//书写组件配置项目 相当于写js代码的地方
//要求template必须有且只有一个根元素，如果有两个就不知道绑定那个
export default {
    //export default 相当于过去的new vue ({el:"#div"})
    //全部都是json格式

    props: {
        //注册属性，用来父子组件传递参数使用
    },
    data() {
        //定义数据的地方
        return {
            couponName: '查看优惠券',
            payMoney: '',//支付金钱
            userTime: '',//消费时间
            useTime: '',//使用时间 分钟
            store: [], //门店信息
            id: "", //优惠卷id
            timer: null, //定时器
            orderMsg: [],
            coupon: [],//优惠券信息
            form: {

                totalAmount: '',//总价
                payMoney: '',//实际支付
                stationId: '',
                couponId: null,
                userId: '',
                storeId: '',
                useTime: '',
                carId: '',
                orderId: '',//洗车记录订单id
                id: null//优惠券数据库主键
            },//传到后端的数据
        };
    },
    created() {
        const dataParam = this.$route.query.data;
        const coupon = this.$route.query.coupon;
        //将数据解析为对象或者数据
        if (dataParam) {
            const orderMsg = JSON.parse(dataParam);
            this.orderMsg = orderMsg;
        }
        if (coupon) {
            const coupon1 = JSON.parse(coupon);
            this.coupon = coupon1;
            this.couponName = this.coupon.couponName
        }
        this.orderMsg.startTime = moment(this.orderMsg.startTime).format("YYYY-MM-DD HH:mm:ss"); //格式化时间
        this.consumptionTime(this.orderMsg.startTime);
        this.selectStoreName(this.orderMsg.storeId)

    },
    mounted() { },
    methods: {
        //1,根据门店id查询门店名称
        selectStoreName(storeId) {
            axios.post("http://172.16.7.55:7011/my/store/selectByStoreId?storeId=" + storeId).then(resp => {
                this.store = resp.data.data;
            })
        },

        //使用时间
        consumptionTime(a) {
            this.timer = setInterval(() => {
                //获取当前时间
                let yy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;
                let dd = new Date().getDate();
                let hh = new Date().getHours();
                let mf =
                    new Date().getMinutes() < 10
                        ? "0" + new Date().getMinutes()
                        : new Date().getMinutes();
                let ss =
                    new Date().getSeconds() < 10
                        ? "0" + new Date().getSeconds()
                        : new Date().getSeconds();
                //格式化当前时间
                let gettime =
                    yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;

                //用当前时间-开始时间=使用时间
                let b = moment(gettime).diff(moment(a), "seconds");
                this.useTime = Number(parseFloat(b / 60).toFixed(0));
                let c = b / 60 / 60;
                let that = this;
                if (c >= 1) {
                    //parseFloat(c).toFixed(1):保留一位小数
                    that.userTime = parseFloat(c).toFixed(2) + "小时";
                } else {
                    that.userTime = parseFloat(b / 60).toFixed(1) + "分钟";
                }
                // 每隔一定时间触发的逻辑操作
            }, 1000); // 10秒钟触发一次
        },

        //3,选择优惠卷
        chooseCarTicket() {
            //跳转页面时传参
            this.$router.push({
                path: "/CarWashTicket",
                query: {
                    userId: this.orderMsg.userId,
                    storeId: this.orderMsg.storeId,
                    data: JSON.stringify(this.orderMsg),
                },
            });
        },

        //6,点击结算，计算消费金额
        countMoney() {
            clearInterval(this.timer); //清空定时器
            this.form.totalAmount = parseFloat(this.useTime) * 0.5;
            this.form.orderId = this.orderMsg.orderId;
            this.form.useTime = this.useTime;
            this.form.userId = this.orderMsg.userId;
            this.form.storeId = this.orderMsg.storeId;
            this.form.stationId = this.orderMsg.stationId;
            this.form.payMoney = this.form.totalAmount;
            if (this.coupon.couponId != null) {
                if (parseFloat(this.coupon.couponMoney) < this.form.payMoney) {
                    this.form.payMoney = parseFloat(this.form.totalAmount) - parseFloat(this.coupon.couponMoney)
                    this.form.id = this.coupon.id
                    this.payCarMoney(this.form)
                } else {
                    this.$dialog
                        .confirm({
                            title: "提示",
                            message: "洗车卷额度高于消费金额，是否使用余额支付",
                            confirmButtonColor: "red",
                        })
                        .then(() => {
                            this.payCarMoney(this.form);
                        })
                        .catch(() => {
                            console.log("取消");
                        });
                }
            } else {
                this.payCarMoney(this.form)
            }

        },
        //结算
        settlememnt() {
            this.$dialog
                .confirm({
                    title: "提示",
                    message: "是否要进行结算",
                    confirmButtonColor: "red",
                })
                .then(() => {
                    console.log("确认");
                    this.countMoney();
                })
                .catch(() => {
                    console.log("取消");
                });
        },
        //计算的方法
        payCarMoney(form) {
            form.productId = form.id
            console.log(form);

            axios.post("http://172.16.7.55:7011/my/carWashRecord/payCarMoney", form).then(resp => {
                if (resp.data.code == 200) {
                    Toast("付款成功")
                    this.jump('home')
                } else {
                    this.$dialog
                        .confirm({
                            title: "支付错误，请检查余额是否充足，或稍后再试",
                            message: "点击确认前往充值",
                            confirmButtonColor: "red",
                        })
                        .then(() => {
                            console.log("确认");
                            this.recharge();
                        })
                        .catch(() => {
                            console.log("取消");
                        });
                }
            })
        },
        //充值洗车
        recharge() {
            this.$router.push({
                path: "/Payment",
                query: {
                    storeId: this.orderMsg.storeId
                },
            });

        },

        //  方法事件处理
        jump(uri) {
            this.$router.push(
                uri,
                () => { },
                () => { }
            );
        },
    },
    components: {
        // 组件注册的地方 相当于pom文件
    },
};
</script>

<style scoped></style>
