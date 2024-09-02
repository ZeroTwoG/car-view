<template>

    <div>
        <!-- 返回上级按钮 -->
        <!-- 粘性布局 -->
        <van-sticky>
            <!-- 导航栏 -->
            <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="goStore"></van-nav-bar>
            <!-- 标题 -->
        </van-sticky>
        <!--         轮播图：商品图片-->
        <van-swipe :autoplay="3000">
            <!-- 循环拿到的该商品的图片 -->
            <van-swipe-item v-for="(image, index) in productImages" :key="index">
                <img :src="image" style="height: 300px; width: 100%; border-radius: 7px">
            </van-swipe-item>
        </van-swipe>
        <!--        <img :src="productImages" style="width: 100%; height: 300px; border-radius: 7px"/>-->
        <div style="width: 100%; height: 45px; background-color: #66c6f2">
            <span style="
              font-size: 26px;
              color: white;
              display: block;
              margin-left: 18px;
              margin-top: 5px;
              float: left;
            ">
                <!-- 积分赋值 -->
                {{ integral }}
            </span>
            <span style="
              font-size: 16px;
              color: white;
              display: block;
              margin-left: 4px;
              margin-top: 4px;
              float: left;
            ">
                <span>{{ priceValue }}&nbsp;&nbsp;</span>
                <span style="
              font-size: 26px;
              margin-left: -17px;">
                    <!-- 金额赋值 -->
                    {{ price }}
                </span>
                <span style="text-decoration: line-through">价格￥{{ product.loadPrice }} </span>
            </span>
            <span style="
              font-size: 16px;
              color: white;
              display: block;
              margin-right: 18px;
              margin-top: 10px;
              float: right;
            ">
                月售量{{ product.monthlySales }}件</span>
        </div>
        <div style="width: 100%; height: 150px">
            <van-cell-group>
                <van-cell v-model="product.productName" style="font-size: 17px; height: 50px;padding: 15px;" />
                <van-col style="
                text-align: left;
                font-size: 17px;
                padding: 15px 16px;
                width: 30%;
              ">运费
                </van-col>
                <van-col @click="show = true" style="
                text-align: right;
                font-size: 17px;
                padding: 15px 16px;
                width: 70%;
                font-size: 17px;
                height: 45px">{{ product.freight }}元
                    <van-icon name="arrow" />
                </van-col>

                <van-row style="width: 100%; height: 3px; background-color: #f1f3f4">
                    <van-col span="24"></van-col>
                </van-row>

                <van-col style="
                text-align: left;
                font-size: 17px;
                padding: 8px 16px;
                width: 30%;
              ">温馨提示
                </van-col>
                <van-col @click="show1 = true" style="
                text-align: right;
                font-size: 17px;
                padding: 8px 16px;
                width: 70%;
              ">
                    <van-icon name="ellipsis" />
                </van-col>
            </van-cell-group>
        </div>
        <!-- 弹框 -->
        <van-action-sheet v-model="show" title="运费说明">
            <div class="content">免运费,部分地区不包邮</div>
            <div class="content">{{ product.freight }}元</div>
        </van-action-sheet>
        <!-- 弹框 -->
        <van-action-sheet v-model="show1" title="温馨提示">
            <div class="content">
                {{ product.prompt }}
            </div>
        </van-action-sheet>
        <van-row style="width: 100%; height: 5px; background-color: #f1f3f4">
            <van-col span="24"></van-col>
        </van-row>
        <!--评价和好评率-->
        <van-row style="height: 45px; padding: 10px 16px">
            <van-col span="16" style="
              text-align: left ;
              font-size: 18px;
              font-weight: bold;
              width: 50%;
              float: left;
            ">商品评价({{ total }})
            </van-col>
            <van-col @click="goEvaluate" span="8"
                style="text-align: right; font-size: 16px; width: 50%; float: right">好评率{{ goodRatingsPercentage }}%
                <van-icon name="arrow" />
            </van-col>
        </van-row>
        <!-- 评价内容 -->
        <div v-if="productReviews != null" style="padding: 10px 16px" v-for="(productReview, index) in productReviews"
            :key="index">
            <van-row style="width: 100%; height: 45px">
                <van-col span="12">
                    <!--                     头像-->
                    <van-image round width="10rem" height="10rem" :src="productReview.user.avatar"
                        style="width: 40px; height: 40px; float: left" />
                    <div style="margin-left: 55px">
                        <div style="text-align: left; color: gray;color: black;">热心市民xxx
                        </div>
                        <van-rate v-model="productReview.text.rating" :size="20" color="#ffd21e" void-icon="star"
                            void-color="#eee" readonly />
                    </div>
                </van-col>
                <van-col span="12" style="text-align: right; color: gray">
                    {{ productReview.text.createTime }}
                </van-col>
            </van-row>
            <van-row>
                <van-col span="24" style="text-align: left; margin: 10px 0px">{{ productReview.text.content }}
                </van-col>
            </van-row>
        </div>

        <!-- 店铺 -->
        <van-row style="width: 100%; height: 1px; background-color: #f1f3f4">
            <van-col span="24"></van-col>
        </van-row>
        <van-row style="height: 65px; padding: 18px">
            <van-col span="24">
                <!-- 店铺图片 -->
                <van-image v-if="selectPeopleAndRating != null" width="70" height="70"
                    :src="selectPeopleAndRating.storeImg" radius="8px" style="float: left" />
                <div style="margin-left: 85px">
                    <div style="text-align: left; margin: 10px 0px">
                        {{ selectPeopleAndRating.storeName }}
                        <span style="float: right; margin-right: 30px"><van-tag type="primary" size="large"
                                @click="jump(product)">进店逛逛</van-tag>
                        </span>
                    </div>
                    <van-rate v-if="selectPeopleAndRating != null" v-model="selectPeopleAndRating.rating" :size="20"
                        color="#ffd21e" void-icon="star" void-color="#eee" style="float: left" allow-half readonly />
                    <div v-if="selectPeopleAndRating != null" style="float: left; color: gray; margin-left: 5px">
                        {{ selectPeopleAndRating.collectPeople }}人收藏
                    </div>
                </div>
            </van-col>
        </van-row>

        <!-- 商品详情 -->
        <van-row style="height: 6px; background-color: #f1f3f4">
            <van-col span="24"></van-col>
        </van-row>
        <van-row style="height: 400px; padding: 10px 16px">
            <van-col span="24">
                <div style="font-size: 18px; text-align: left; margin: 15px 0px">
                    商品详情
                </div>
                <div style="
                font-size: 17px;
                text-align: left;
                font-weight: bold;
                padding: 10px;
                line-height: 35px;" v-html="productDetails">
                </div>
            </van-col>
        </van-row>

        <van-row>
            <van-col span="24">&nbsp;</van-col>
        </van-row>

        <!-- 底部标签 -->
        <!-- 门店和立即兑换 -->
        <van-tabbar style="height: 50px">
            <van-tabbar-item style="color: black">
                <van-icon name="shop-o" size="30" />
                <span style="font-size: 18px" @click="jump(product)">门店</span>
            </van-tabbar-item>

            <van-tabbar-item style="background-color: #fc5531; color: white"><span style="font-size: 18px"
                    @click="goOrder(product)">立即兑换</span></van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "SingleCommodity",
    data() {
        return {
            productImages: [],//轮播商品图存放
            product: {}, //存放从上个页面传过来的商品信息
            show: false, //运费弹框是否显示
            show1: false, //温馨提示弹框是否显示
            productDetails: "", //商品详情赋值
            storeimage: "", //给门店图片赋值
            freight: "", //给运费信息赋值
            price: "", //商品价格
            priceValue: "", //商品积分和商品价格中间的字
            integral: "", //商品积分
            evaluate: {}, //门店评价星级
            collectioncount: 0, //收藏人数
            reviewCount: {}, //评论数和好评率
            productReviews: {}, //查询到的商品评论
            total: 0, //评论人数
            goodRatingsPercentage: 0, //好评率
            productId: '',//接后端传过来的查询评论的id
            commentLength: 0,
            products: [],
            selectPeopleAndRating: {
                collectPeople: 0,//收藏人数
                rating: 0,
            },
            imageUrlss: require("../../assets/img/1.png"),
        }
    },
    created() {
        this.queryProductImage();
        this.selectReviewCount();
        this.selectReview();
        this.selectPeopleAndRatingByStoreId();
        this.init();
    },
    methods: {
        //查询商品ok
        queryProductImage() {
            //拿到上个页面传过来的参数
            const dataParam = this.$route.query.data;
            //将数据解析为对象或者数据
            if (dataParam) {
                const product = JSON.parse(dataParam);
                this.product = product;
                console.log("this.product", this.product)
                var _this = this;
                this.$axios.get(`/store/product/selectProductImagesByProductId/${product.productId}`)
                    .then(function (response) {
                        _this.productImages = response.data.data;
                        _this.productImages[0] = product.picture;
                        _this.product = product;
                        //给商品名称赋值
                        _this.productName = product.productName;
                        //给商品详情赋值
                        _this.productDetails = product.productDetails;
                        //给门店封面赋值
                        _this.storeimage = product.storeimage;
                        //判断是否有运费这个字段
                        if (product.isFreightShipping == 0) {
                            _this.freight = "免运费,部分地区不包邮";
                        } else if (product.isFreightShipping == 1) {
                            _this.freight = product.freight + "元";
                        }
                        //判断积分是否启用
                        if (product.integralEnabled == 0) {
                            //积分启用 如果设置现价，就显示积分加现价
                            if (product.newPrice > 0) {
                                _this.integral = product.integral;
                                _this.priceValue = "积分+￥";
                                _this.price = product.newPrice;
                            } else {
                                _this.integral = product.integral;
                                _this.priceValue = "积分 ";
                            }
                        } else {
                            _this.price = product.newPrice;
                            _this.priceValue = "￥";
                        }
                        //查询收藏人数和执行查询门店星级
                        _this.selectPeopleAndRatingByStoreId();
                        //查询评论人数
                        _this.selectReviewCount();
                        //查询评论
                        _this.selectReview();
                    })
                    .catch(function (error) {
                        // console.log(error);
                    });
            }
        },
        //获取商品评价人数和评分星级ok
        selectPeopleAndRatingByStoreId() {
            const data = this.$route.query.data;
            if (data) {
                const product = JSON.parse(data);
                this.product = product;
            }
            console.log("查询商品评价人数和评分星级")
            this.$axios.get(`/store/product/selectTbStoreEvaluate/${this.product.storeId}`)
                .then(resp => {
                    if (resp.data.code == 200) {
                        this.selectPeopleAndRating = resp.data.data;
                        console.log(this.selectPeopleAndRating)
                        this.storeimage = this.selectPeopleAndRating.storeImg;
                        this.product.storeName = this.selectPeopleAndRating.storeName;
                        this.product.storeimage = this.storeimage
                    } else {
                        this.selectPeopleAndRating = null;
                        this.storeimage = null;
                    }

                })
            this.selectReview()
        },
        //查询商品评价ok
        selectReview() {
            const data = this.$route.query.data;
            if (data) {
                const product = JSON.parse(data);
                this.product = product;
            }
            this.$axios.get(`/store/product/selectTbProduckreviewByProductId/${this.product.productId}`)
                .then(resp => {
                    if (resp.data.code == 200) {
                        console.log(resp.data.data);
                        var dataNum = resp.data.data

                        this.productReviews = dataNum.slice(0, 3);//截取查询结果的前三条
                        this.total = dataNum.length;
                        var num = 0;
                        for (var i = 0; i < dataNum.length; i++) {
                            num += (dataNum[i].text.rating) * 20
                        }
                        this.goodRatingsPercentage = num / this.total
                    } else {
                        this.total = 0
                        this.productReviews = null;
                        this.goodRatingsPercentage = 0;
                    }

                })
        },
        hidePhoneNumber(phone) {
            // 隐藏手机号的第二位开始的所有字符
            return phone.slice(0, 1) + "*".repeat(phone.length - 1);
        },

        //查询商品评价的数量和好评率 弃用
        selectReviewCount() {
            // let _this = this;
            // this.$http
            //     .post(
            //         "/product/mobile/store/api/selectContentByProductId?productId=" + this.product.productId
            //     )
            //     .then(function (response) {
            //         _this.reviewCount = response.data.data; //查询出来的评价的数量和好评率
            //         _this.total = _this.reviewCount.total;
            //         _this.goodRatingsPercentage = _this.reviewCount.goodRatingsPercentage;
            //     })
            //     .catch(function (error) {
            //     });
        },

        goEvaluate() {
            //  商品评论
            this.$router.push({
                path: "/Evaluate",
                query: {
                    data: this.product.productId,
                    total: this.total,
                },
            });
        },

        //将当前页面的数据存储再localStorage本地中
        selecteAddress(index) {
            //index：当前页面传过去的参数
            localStorage.setItem("productDatas", JSON.stringify(index))
        },
        //下次从别的页面返回回来时加载localStorage本地的数据
        init() {
            const productDatas = localStorage.getItem("productDatas")
            if (productDatas != null) {
                this.product = JSON.parse(productDatas)
                localStorage.removeItem("productDatas");
            }
        },


        //跳转店铺页面
        jump(product) {
            if (product.storeId) {
                this.$router.push({
                    path: "/StoreCheck",
                    query: {
                        data: JSON.stringify(product)
                    },
                });
            } else {
                console.log("该商品没有暂时没有门店信息")
            }
        },
        //跳转 立即兑换
        goOrder(product) {
            this.$router.push({
                path: "/SingleOrder",
                query: {
                    data: JSON.stringify(product)
                },
            });
        },
        //跳转商城页面
        goStore() {
            this.$router.push("/Store");

        },
    }
}
</script>

<style scoped>
.content {
    padding: 16px 16px 160px;
    text-align: left;
}
</style>