<template>
    <div>
        <!-- 头部刷新 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

            <van-row style="background: #ffffff">
                <van-col span="21">
                    <van-search shape="round" placeholder="请输入商品信息" @click="serchProductName" />
                </van-col>
                <van-col span="3" style="margin-top: 15px; text-align: left; font-size: 24px">
                    <van-icon name="search" />
                </van-col>
            </van-row>

            <van-swipe class="my-swipe" :autoplay="1500" indicator-color="white">
                <van-swipe-item v-for="(image) in images">
                    <img :src="image" style="height: 195px; width: 100%; border-radius: 7px" />
                </van-swipe-item>
            </van-swipe>

            <van-row>
                <van-col span="24">&nbsp;</van-col>
            </van-row>


            <van-tabs v-model="activeTab" color="#1989FA" title-active-color="#1989FA" @change="handleTabChange"
                animated>
                <!--productTypes 循环该集合，拿到每一个productType 将名称赋给title  -->
                <van-tab v-for="productType in productTypes" :title="productType.name" :key="productType.commentId"
                    :name="productType.commentId">
                    <!-- column-num:设置列数 -->
                    <van-grid :border="false" :column-num="2">
                        <van-grid-item v-for="product in products" :key="product.productId"
                            @click="goCommodity(product)">

                            <div style="width: 100%;height: 180px">
                                <img :src="product.picture" style="width: 100%;height: 180px" alt="">
                            </div>

                            <div style="text-align: left; width: 100%; margin: 8px; height: 40px">
                                {{ product.productName }}
                            </div>
                            <!-- 如果启动积分 并且现价大于0 那么显示该布局 -->
                            <span style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left: -29px;
                    top: -7px;" v-if="product.integralEnabled == 0 && product.newPrice > 0">
                                <span style="font-size: 22px">{{ product.integral }}</span>积分+￥
                                <span style="font-size: 22px;
                          position: relative;
                          left: -7px;">
                                    {{ product.newPrice }}</span>
                            </span>
                            <!-- 如果现价小于0显示该布局 -->
                            <span style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;" v-else-if="product.newPrice <= 0">
                                <span style="font-size: 22px">{{ product.integral }}</span>积分
                            </span>
                            <!-- 如果不启用积分 就使用该布局 -->
                            <span style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;" v-else>
                                ￥<span style="font-size: 22px">{{ product.newPrice }}</span>
                            </span>
                            <div style="margin: 8px; width: 100%">
                                <span style="
                      font-size: 14px;
                      color: gray;
                      text-decoration: line-through;
                      display: block;
                      float: left;
                    ">￥{{ product.loadPrice }}</span>
                                <span style="display: block; float: right">月销{{ product.monthlySales }}</span>
                            </div>
                            <div style="text-align: left; width: 100%; margin: 8px; height: 30px">
                                {{ product.storeName }}&nbsp;&nbsp;<van-icon name="arrow" />
                            </div>
                        </van-grid-item>
                    </van-grid>


                </van-tab>
            </van-tabs>

            <van-row>
                <van-col span="24">&nbsp;</van-col>
            </van-row>
            <van-row>
                <van-col span="24">&nbsp;</van-col>
            </van-row>


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
import axios from "axios";
import { Toast } from "vant";

export default {
    data() {
        return {
            isLoading: false, //刷新参数
            active: "shop", //底部标签绑定
            images: [
                //轮播图
                require("../../assets/img/carousel/商城轮播图片3.png"),
                require("../../assets/img/carousel/门店图片轮播3.png"),
                require("../../assets/img/carousel/门店轮播图片1.png"),
            ],
            productTypes: [], //商品类型对象
            activeTab: "",
            products: undefined, //商品对象
            proTypeId: '',
            optionProduct: [],//输入框选择商品搜索
            productName: '', //根据商品名称查询
            selectProductName: '',
        }
    },
    created() {
        this.loadProductType();
        this.queryByProduct();
        // this.handleTabChange(this.proTypeId);
    },
    methods: {
        //模糊查询商品名称
        serchProductName() {
            this.$router.push('/SearchPage');
        },

        //查询ProductType方法
        loadProductType() {
            //这里使用funtion传参必须用let _this=this;
            this.$axios.get("/store/productType/selectAllProductType").then(response => {
                this.productTypes = response.data.data;
                this.queryByProduct();
                this.handleTabChange(this.productTypes[0].commentId);
            })
                .catch(function (error) {
                    // console.log(error);
                });
        },
        //点击标签时，拿到商品类型id查询到该类型的商品
        handleTabChange(productTypeId) {
            this.proTypeId = productTypeId;
            this.queryByProduct();
        },

        //根据商品类型查询商品
        queryByProduct() {
            this.$axios.get("/store/product/select?proTypeId=" + this.proTypeId + "&productName=" + this.productName).then(resp => {
                let datas = resp.data.data;
                console.log("商品:::")
                console.log(resp.data.data)
                if (datas != null) {
                    this.products = datas.tbProduct;
                    for (let i = 0; i < this.products.length; i++) {
                        this.products[i].storeId = datas.tbStore[i].storeId;
                        this.products[i].storeName = datas.tbStore[i].storeName;
                        this.storeimage = datas.tbStore[i].storeimage;
                    }
                }

            })
        },

        // 跳转商品页面
        goCommodity(product) {
            //  路径/store对应router目录下index.js中定义的path属性值
            this.$router.push({
                path: "/SingleCommodity",
                query: {
                    data: JSON.stringify(product),
                },
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
        //跳转页面的方法
        jump(uri) {
            this.$router.push(uri);
        },
    }
}
</script>
<style scoped></style>