<template>
    <!-- 洗车卷页面 -->
    <div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar title="选择优惠券" left-arrow @click-left="onClickLeft" />
            </van-sticky>

            <!-- 列出洗车卷信息 -->
            <div v-for="item in wanshCarTicket" style="margin-left: 15px" :key="item.id">
                <van-radio-group v-model="radio" v-if="wanshCarTicket.length >= 1">
                    <van-radio style="margin-top: 18px; margin-bottom: 18px" :name="item">{{ item.couponName
                        }}</van-radio>
                    <div style="background: #f6f6f6; height: 1px"></div>
                    <!-- 确定按钮 -->
                    <van-tabbar style="height: 8%">
                        <van-col span="24"><van-button round type="info" style="width: 100%"
                                @click="chooseTicket(radio)">确定</van-button></van-col>
                    </van-tabbar>
                </van-radio-group>
            </div>

            <!-- 没有洗车卷 -->
            <div style="margin-top: 80px">
                <van-row v-show="flag">
                    <van-col span="24">暂无可用优惠卷0.0</van-col>
                </van-row>
            </div>
            <div style="height: 333px"></div>
        </van-pull-refresh>
    </div>
</template>
<!--书写组件配置项目  相当于写js代码的地方 -->
<script>
//数据 全是json格式
import axios from "axios";
import { Toast } from "vant";

export default {
    //注册属性 父传子 数据传递
    props: {},
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data() {
        //定义数据
        return {
            orderMsg: [],
            isLoading: false, //刷新参数
            wanshCarTicket: [], //存放洗车卷信息
            radio: "", //单框的双向绑定
            id: "", //确定选择的洗车卷后，返回的洗车卷id

            flag: false, //判断是否有洗车卷
            form: {
                userId: "", //用户id
                storeId: "", //店铺id
            },//传去后端的数据
        };
    },
    //初始化数据
    created() {
        this.form.userId = this.$route.query.userId;
        this.form.storeId = this.$route.query.storeId;
        this.selectHaveTicket(this.form);
        const dataParam = this.$route.query.data;
        //将数据解析为对象或者数据
        if (dataParam) {
            const orderMsg = JSON.parse(dataParam);
            this.orderMsg = orderMsg;
        }
    },
    //方法书写
    methods: {
        //刷新方法
        onRefresh() {
            setTimeout(() => {
                Toast("刷新成功");
                this.isLoading = false;
                //调用请求
            }, 1000);
        },
        //查询用户是否有优惠卷
        selectHaveTicket(form) {
            axios.post("/my/washCarCoupon/selectCouponByUserId/" + form.userId + "/" + form.storeId).then(resp => {
                if (resp.data.code === 500) {
                    this.flag = true;
                } else {
                    this.wanshCarTicket = resp.data.data
                }
            }).catch(function (error) {
                console.log(error);
            });
        },

        //确定选择的优惠卷
        chooseTicket(radio) {
            //跳转页面时传参
            this.$router.push({
                path: "/SettlementIsOpen",
                query: {
                    coupon: JSON.stringify(radio),
                    data: JSON.stringify(this.orderMsg)
                },
            });
        },

    },
    //声明注解
    components: {},
};
</script>
<style scoped></style>
