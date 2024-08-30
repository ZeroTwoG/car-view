<template>
    <div id="app">

        <van-sticky>
            <van-nav-bar title="我的订单" left-arrow @click-left="onClickLeft" />
        </van-sticky>
        <van-tabs v-model="active" :sticky="true" :duration="0.5" :swipe-threshold="1" :offset-top="this.heightall"
            title-active-color="#1989fa" color="#1989fa" line-height="4px" line-width="45px" @change="handleTabChange">
            <van-tab v-for="tab in tabs" :key="tab.statusCode" :title="tab.name" :name="tab.statusCode">
            </van-tab>
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <div v-for="(item, index) in orderList" :key="index">
                    <div class="o-head">
                        <van-row vertical-align: middle>
                            <van-col span="3">
                                <van-image width="30" height="30" class="store-icon" :src="item.storeimage" />
                            </van-col>
                            <van-col span="10"
                                style="font-size: 15px; text-align:left; color: #7c696c; margin-top: 4px">{{
                                    item.storeName }}
                            </van-col>
                            <van-col span="8" style="color: #6face9; font-size: 14px">{{
                                item.statusCode
                            }}
                            </van-col>
                        </van-row>

                    </div>
                    <van-card :num="item.productCount" :price="getDisplayPrice(item)" :title="item.productName"
                        :thumb="item.picture" style="text-align: left" class="card-item">
                        <template #footer>
                            <span v-show="item.statusCode != 1 && item.statusCode != 5">
                                <p style="font-size: 10px">
                                    <span>实付款:</span>
                                    <span v-if="item.payType == 0" style="color: #ff0000; font-size: 15px">￥{{
                                        item.totalAmount }}</span>
                                    <span v-if="item.payType == 1" style="color: #ff0000; font-size: 15px">{{
                                        item.totalIntegral }}积分</span>
                                    <span v-if="item.payType == 2" style="color: red; font-size: 15px">{{
                                        item.totalIntegral }}积分+￥{{ item.totalAmount }}</span>
                                </p>
                            </span>
                            <van-button round type="default" style="background: #f6f6f6" size="small"
                                @click="del(item.id)" v-if="item.statusCode !== 2 && item.statusCode !== 3">删除订单
                            </van-button>
                            <van-button round style="background: #019fe8; color: #ffffff" size="small"
                                @click="fk(item)">{{ formatText(item.statusCode) }}
                            </van-button>
                        </template>
                    </van-card>
                </div>
            </van-list>
        </van-tabs>
        <van-col span="10"></van-col>
    </div>
</template>

<script>
import axios from "axios";
import { Dialog, Toast } from "vant";

export default {

    name: "Unpaid",
    data() {
        return {
            // 默认选中的导航项
            active: Number(this.$route.query.statusCode),
            //方便编写表单校验
            heightall: 0,
            tabs: [
                { name: "待付款", statusCode: 1 },
                { name: "待发货", statusCode: 2 },
                { name: "待收货", statusCode: 3 },
                { name: "已完成", statusCode: 4 }, //已经完成的
                { name: "已评价", statusCode: 6 }, //收到货后评价的订单
                { name: "已取消", statusCode: 5 }, //订单超时的订单
                { name: "全部", statusCode: 0 },
            ],
            orderList: [], //查询订单的数量
            totalAmount: 0, //支付总金额
            loading: true,
            finished: false,
            pageNo: 1,
            pageSize: 5,
            activeTab: "",
            statusCode: Number(this.$route.query.statusCode), //支付状态码
            userId: 0, //用户id
            product: {}, //商品对象
        }
    },
    created() {
        var item = sessionStorage.getItem("user");
        var user = JSON.parse(item);
        this.userId = user.userId
        this.loadData();
    },
    methods: {

        //不同商品类型显示不同 mount总金额 inter总积分
        getDisplayPrice(item) {
            if (item.payType === 0 || (item.totalAmount != 0 && item.totalIntegral == 0)) {
                return `${item.totalAmount}`;
            } else if (item.payType === 1 || (item.totalAmount == 0 && item.totalIntegral != 0)) {
                return `${item.totalIntegral}积分`;
            } else {
                return `${item.totalIntegral}积分+￥${item.totalAmount}`;
            }
        },
        //点击标签时，拿到商品类型id查询到该类型的商品
        handleTabChange(name) {
            this.loading = true;
            this.finished = false;
            this.orderList = [];
            this.pageNo = 1;
            this.statusCode = name;
            this.active = name;
            this.loadData();
        },
        loadData() {
            console.log(this.pageNo);
            console.log(this.pageSize);
            console.log(this.statusCode);
            console.log(this.userId);
            this.$axios.get(`/store/order/OrderMobile/${this.pageNo}/${this.pageSize}/${this.statusCode}/${this.userId}`).then((response => {
                if (response.data.code == 200) {
                    var data = response.data.data.order;
                    var store = response.data.data.store;
                    var product = response.data.data.product;
                    console.log(data)
                    for (let i = 0; i < data.length; i++) {
                        //将查询到的结果遍历到orderList中
                        data[i].storeimage = store[i].storeimage
                        data[i].picture = product[i].picture;
                        this.orderList.push(data[i]);
                    }
                    // 加载状态结束
                    this.loading = false;
                    // 数据全部加载完成
                    //如果数据的个数大于
                    if (data.length <= this.pageSize) {
                        this.finished = true;
                    } else {
                        this.pageNo = this.pageNo + 1;
                        this.finished = true;
                    }
                } else {
                    // Toast.fail("操作失败")
                    this.loading = false;
                    this.finished = true;
                }

            }))
        },

        //按键格式化
        formatText(a) {
            if (a == 1) {
                return "去付款";
            } else if (a == 4) {
                return "去评价";
            } else if (a == 3) {
                return "确认收货";
            } else if (a == 5) {
                return "重新购买";
            } else {
                return "查看订单";
            }
        },
        //删除订单
        del(id) {
            Dialog.confirm({
                title: "删除",
                message: "确认要删除吗？",
            }).then(() => {
                //不再直接使用axois  而是用$http
                axios.delete(`/store/order/deleteById/${id}`).then((response => {
                    if (response.data.code == 200) {
                        Toast.success("删除成功")
                        this.loading = true;
                        this.finished = false;
                        this.orderList = [];
                        this.pageNo = 1;
                        this.loadData();
                    } else {
                        Toast.fail("操作失败")
                    }

                }))
            }).catch(() => {

            })
        },
        //不同按钮的功能路径
        fk(item) {
            //判断订单的状态是否是待付款
            if (item.statusCode == 1) {
                this.$router.push({
                    path: "/pay",
                    query: { data: JSON.stringify(item.id) },
                });
            } else if (item.statusCode === 2 || item.statusCode === 6) {
                this.$router.push({
                    path: "/orderDetailed",
                    query: { data: JSON.stringify(item) },
                });
                //判断订单状态是否是待发货
            } else if (item.statusCode == 3) {
                //判断订单状态是否是待收货
                this.updateStatus(item.id);
            } else if (item.statusCode == 4) {
                //已完成后去评价
                this.$router.push({
                    path: "/orderComment",
                    query: { data: JSON.stringify(item) },
                });
            } else if (item.statusCode == 6) {
                //已评价
            } else if (item.statusCode === 5) {
                //重新购买
                this.selectProduct(item.id);
            }
        },
        //重新购买按钮
        selectProduct(id) {
            Dialog.confirm({
                title: "确认购买",
                message: "是否重新购买？",
            }).then(() => {
                this.$http.post("/order/api/updateBuyStatus", { id }).then((response => {
                    if (response.data.code == 200) {
                        Toast.success("已加入待付款")
                        this.handleTabChange(11)
                    } else {
                        Toast.fail("已取消")
                    }

                }))
            }).catch(() => {

            })
        },
        //点击收货后 改变订单状态为已完成
        updateStatus(id) {
            Dialog.confirm({
                title: "确认收货",
                message: "是否确认收货？",
            }).then(() => {
                this.$http.post("/order/api/updateStatus?id=" + id).then((response => {
                    if (response.data.code == 200) {
                        Toast.success("确认收货成功")
                        this.handleTabChange(46)
                    } else {
                        Toast.fail("取消确认")
                    }

                }))
            }).catch(() => {

            })
        },
        onClickLeft() {
            //返回
            this.$router.push('/my')

        },

        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                this.loadData();
            }, 1000);
        },
    },
    components: {
        [Dialog.Component.name]: Dialog.Component,
    },

}
</script>

<style scoped>
.store-icon {
    left: 12px;
}

.van-card {
    font-size: 13px;
    margin-top: 2px;
    margin-bottom: 13px;
}
</style>