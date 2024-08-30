<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar style="height: 65px" title="确认订单" left-arrow @click-left="goSingleCommodity" />
        <div class="second">
            <!-- 地址 -->
            <div style="height: 90px" class="addressValue">
                <van-cell is-link @click="toAddressManagementStore(userId)">
                    <!-- 收货地址 -->
                    <template #title>
                        <div class="custom-title">
                            <van-icon name="map-marked" class="icon" />
                            <div class="custom-value">
                                <van-row>
                                    <van-col>
                                        {{ addressData.addressName }}
                                    </van-col>
                                    <van-col>
                                        &nbsp; &nbsp;{{ addressData.phone }}
                                    </van-col>
                                </van-row>
                                <div class="gap"></div>
                                <van-row>
                                    <van-col>
                                        {{ addressData.province }}{{ addressData.city }}&nbsp&nbsp{{
                                        addressData.district }}{{ addressData.detail }}
                                    </van-col>
                                </van-row>
                                <div style="width: 202px;position: absolute;right: 35px;font-size: 19px;top: 28px;">
                                    {{ addressValue }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #value>
                    </template>
                </van-cell>
            </div>

            <div style="background-color: #dadce0; height: 4px"></div>

            <!-- 分割线 -->
            <div style="background-color: #f1f3f4"></div>

            <!-- 店铺 -->
            <van-row style="margin-top: 20px">
                <van-col span="24">
                    <van-image width="30" height="30" radius="5px" :src="product.storeimage"
                        style="width: 40px; height: 40px; float: left; margin-left: 5%" />
                    <div style="text-align: left; font-size: 17px; margin-left: 18%; margin-top: 2.5%">
                        {{ product.storeName }} &nbsp;&nbsp;<van-icon name="arrow" />
                    </div>
                </van-col>
            </van-row>

            <!--商品模块-->
            <div style="margin-top: 25px">
                <van-row>
                    <van-col span="2" style="margin-left: 6px">
                        <van-image width="100" height="100" radius="5px" :src="product.picture" />
                    </van-col>

                    <van-col span="18" style="margin-left: 40px">
                        <div class="productNameBox">{{ product.productName }}</div>
                        <div style="height: 55px"></div>
                        <span v-if="integral != '0'" style="
                font-size: 22px;
                margin-left: 11%;
                color: red;
                font-weight: bold;
              ">{{ integral }}</span>
                        <span style="font-size: 18px; margin-left: 3%; color: red">{{ priceValue }}</span>
                        <span v style="
              font-size: 22px;
               color: red;
              margin-left: 0px;">
                            <!-- 金额赋值 -->
                            {{ price }}
                        </span>
                        <span style="
                margin-left: 2%;
                color: gray;
                text-decoration: line-through;
              ">￥{{ product.loadPrice }}</span>
                    </van-col>
                    <van-col span="1" style="margin-left: 80%;margin-top: -5%">
                        <!--                        <div style="height: 80px"></div>-->
                        x{{ totalCount }}
                    </van-col>
                </van-row>
            </div>

            <!-- 分割线 -->
            <div style="background-color: #dadce0; height: 8px; margin-top: 20px"></div>
            <!-- 运费 -->
            <van-row>
                <van-col style="
            text-align: left;
            font-size: 17px;
            padding: 10px 16px;
            width: 30%;
          ">运费
                </van-col>
                <van-col class="yunfei" @click="show = true" style="
            text-align: right;
            padding: 10px 16px;
            width: 70%;
            font-size: 17px;
          ">{{ freight }}
                    <van-icon name="arrow" />
                </van-col>
            </van-row>

            <!-- 运费弹框 -->
            <van-action-sheet v-model="show" title="运费说明">
                <div class="content">免运费,部分地区不包邮</div>
            </van-action-sheet>

            <!-- 留言 -->
            <van-cell-group>
                <van-field v-model="value" label="留言" placeholder="   建议留言前先与商家沟通确认" class="liuyan"
                    input-align="right" />
            </van-cell-group>

            <!-- 门店和立即兑换 -->
            <van-tabbar style="height: 50px">
                <van-tabbar-item style="color: black">
                    <span style="font-size: 20px">总计：<span v-if="integral != '0'"
                            style="color: red; font-weight: bold; font-size: 22px">{{ integral }}</span>
                        <span style="color: red; font-weight: bold; font-size: 16px">{{ priceValue }}</span>
                        <!--            <span style="color: red; font-weight: bold; font-size: 22px">{{sumPrice}}</span>-->
                        <span v-if="sumPrice != '0'" style="color: red; font-weight: bold; font-size: 22px">{{ sumPrice
                            }}</span>

                    </span>
                </van-tabbar-item>
                <van-tabbar-item style="background-color: #fc5531; color: white"><span style="font-size: 20px"
                        @click="goPay">提交订单</span></van-tabbar-item>
            </van-tabbar>
        </div>
             
        <!--   订单获取地址页面AddressManagementStore.vue中的所有地址信息，     -->
        <van-popup v-model="addressShow" round position="bottom" :style="{ height: '40%' }" class="popup-container">
            <div class="card-container">
                <van-contact-card type="add" @click="onAdd" />
                <template v-for="item in allAddress">
                    <van-contact-card @click="selectAddress(item)" type="edit" :name="item.addressName"
                        :tel="item.phone" :address="item.province" />
                </template>
            </div>
        </van-popup>

    </div>
</template>

<script>
import { Toast } from "vant";

export default {
    name: "SingleOrder",
    data() {
        return {
            show: false, //运费弹框是否显示

            product: {},
            addressData: {},
            freight: "", //给运费信息赋值
            price: "", //商品价格
            priceValue: "", //商品积分和商品价格中间的字

            totalCount: 1, //商品个数
            sumPrice: '', //总金额
            integral: 0, //商品积分
            statusCode: 11,
            value: "", //用于存储留言信息

            productOrderId: "", //订单id
            addressValue: "",//无地址提示
            //获取当前用户的Id，传给下一个页面，获取对应的地址信息
            userInfo: {},//用户信息
            userId: "", //用户id
            allAddress: [], //存放查询出来的收货地址
            addressShow: false,
            TherUser: {},
        }
    },
    created() {
        const userId = sessionStorage.getItem("user");
        this.TherUser = JSON.parse(userId);
        this.userId = this.TherUser.userId;
        this.loadDatas();
        this.initUserId();
    },
    methods: {
        onAdd() {
            this.$router.push({
                path: "/AddressManagementStore",
                query: { userId: this.userId },
            });
        },
        //提交订单时，有收货地址，跳转支付页面
        goPay() {
            if (!this.addressData) {
                this.hint()
                return;
            }
            console.log({
                userId: this.userId,
                storeId: this.product.storeId,
                productId: this.product.productId,
                storeName: this.product.storeName,
                productName: this.product.productName,
                productCount: this.totalCount,
                totalAmount: this.sumPrice,
                totalIntegral: this.integral,
                statusCode: this.statusCode,
                message: this.value,
                address: this.addressData.addressId,
            })
            this.$axios.post("/store/order/insertProductOrder", {
                userId: this.userId,
                storeId: this.product.storeId,
                productId: this.product.productId,
                storeName: this.product.storeName,
                productName: this.product.productName,
                productCount: this.totalCount,
                totalAmount: this.sumPrice,
                totalIntegral: this.integral,
                statusCode: this.statusCode,
                message: this.value,
                address: this.addressData.addressId,
            }).then(response => {
                console.log("response:", response);
                this.$router.push({
                    path: "/unpaid?statusCode=11",
                    query: {
                        data: JSON.stringify(this.product),
                    },
                });
            }
            )
        },

        //提交订单时，没有写收货地址，执行该方法 给出提示
        hint() {
            Toast("请先添加收获地址");
        },
        //跳转到地址选择页面
        toAddressManagementStore(userId) {
            if (!this.addressData) {
                // addressData 没有信息，跳转到 AddressManagementStore 页面
                this.$router.push({
                    path: "/AddressManagementStore",
                    query: {
                        userId: JSON.stringify(userId),
                    },
                });
            } else {
                // addressData 有信息，显示地址选择页面
                this.addressShow = true;
            }
        },

        //切换地址
        selectAddress(item) {
            this.addressData = item

            console.log("item", item)
            this.addressShow = false
        },

        //获取上个页面的数据
        loadDatas() {
            const dataParam = this.$route.query.data;
            // console.log("dataParam", dataParam)
            if (dataParam) {
                const product = JSON.parse(dataParam);
                this.product = product;
                console.log("product", this.product)
                //判断积分是否启用
                if (this.product.integralEnabled == 0) {
                    //积分启用 如果设置现价，就显示积分加现价
                    if (this.product.newPrice > 0) {
                        if (this.product.integral == 0) {
                            this.integral = 0;
                        } else {
                            this.integral = this.product.integral;
                            this.priceValue = "积分+￥";
                            this.price = this.product.newPrice;
                        }

                    } else {
                        this.integral = this.product.integral;
                        this.priceValue = "积分";
                    }
                } else {
                    this.price = this.product.newPrice;
                    this.priceValue = "￥";
                }
                //判断是否有运费这个字段
                if (this.product.isFreightShipping == 0) {
                    this.freight = "免运费,部分地区不包邮";
                    if (this.product.newPrice == 0) {
                        this.sumPrice = 0;
                    } else {
                        this.sumPrice = this.product.newPrice;
                    }
                } else if (this.product.isFreightShipping == 1) {
                    this.freight = this.product.freight + "元";
                    this.sumPrice = this.price + this.product.freight;
                }
            }
        },
        //查询当前用户Id，传到下一个页面addressManagement中，拿到该用户的地址信息ok
        initUserId() {
            console.log(this.TherUser.userId)
            this.$axios.get(`/store/order/getUserAndAddressByUserId/${this.TherUser.userId}`).then((res => {
                console.log(res.data)
                if (res.data.code === 200) {
                    this.userInfo = res.data.data.user;
                    this.allAddress = res.data.data.address;
                    this.addressValue = this.allAddress.length > 0 ? "" : "请添加收货地址"
                    this.addressData = res.data.data.defaultAddress;
                    console.log("地址:::::")
                    console.log(this.addressData)
                    // 初始化默认地址
                    // findIndex查找元素下标位置
                }
            }))
        },
        //返回上一级
        goSingleCommodity() {
            this.$router.go(-1);
        },
    }
}
</script>
<style scoped>
.yunfei,
.liuyan {
    font-size: 20px;
    /*margin-left: 100px;*/
}

.content {
    padding: 16px 16px 160px;
    text-align: left;
}

.second {
    background-color: #fafafa;
}

.custom-title {
    display: flex;
    align-items: center;
}

.icon {
    margin-right: 8px;
}

.icon[data-v-3f8ea0ee] {
    margin-right: 8px;
    font-size: 36px;
    line-height: 54px;
}

.custom-value {
    width: 280px;
    margin-left: 11px;
}

.gap {
    height: 7px;
}

.productNameBox {
    position: relative;
    left: 38px;
    text-align: left;
    width: 200px;
}
</style>