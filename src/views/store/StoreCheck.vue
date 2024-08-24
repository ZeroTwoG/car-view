<template>
    <div>
        <div style="
        text-align: left;
        height: 45px;
        width: 450px;
        background-color: #1989fa;
        padding: 5px;">
            <!-- 跳转回商品商城页面 -->
            <div
                    @click="goStore"
                    style="float: left"
            >
                &nbsp;&nbsp;<van-icon
                    name="arrow-left"
                    style="float: left; margin-top: 15px"
            />
            </div>
            <!-- 搜索框 -->
            <div style="float: left; margin-top: 14px">
                <van-search
                        v-model="productName"
                        shape="round"
                        background="#1989fa"
                        placeholder="请输入商品名称"
                        style="width: 220px; height: 10px"
                        @search="onSearch"
                />

            </div>
            <van-col
                    span="3"
                    style="margin-top: 12px; text-align: left; font-size: 24px;margin-left: -5px"
            >
                <van-icon name="search"
                          @click="onSearch"
                />
            </van-col>
        </div>

        <van-row style="height: 65px; padding: 20px">
            <van-col span="24">
                <!-- 店铺图片 -->
                <van-image
                        width="70"
                        height="70"
                        :src="storeimage"
                        radius="8px"
                        style="float: left"
                ></van-image>
                <div style="margin-left: 85px">
                    <div style="display: flex; align-items: center; margin: 10px 0;">
                        <div style="flex-grow: 1; margin-top: -22px">
                            {{ product.storeName }}
                        </div>
                        <div style="display: flex; align-items: center;">
                            <van-button @click="Dialog" round type="info" style="margin-left: 4px;">
                                <van-icon name="service-o" style="margin-right: 4px;"></van-icon>
                                客服
                            </van-button>
                        </div>
                    </div>
                    <div style="float: left;margin-top: -20px">
                        <van-rate
                                v-model="selectPeopleAndRating.rating"
                                :size="20"
                                color="#ffd21e"
                                void-icon="star"
                                void-color="#eee"
                                allow-half
                                readonly
                        ></van-rate>
                    </div>
                </div>
            </van-col>
        </van-row>
        <!--        <div style="margin-top: 15px">-->
        <!--            <van-swipe :autoplay="3000">-->
        <!--                <van-swipe-item-->
        <!--                        v-for="(image, index) in images"-->
        <!--                        :key="index"-->
        <!--                >-->
        <!--                    <img-->
        <!--                            v-lazy="image"-->
        <!--                            :src="image"-->
        <!--                            style="height: 300px; width: 460px; border-radius: 7px"-->
        <!--                    />-->
        <!--                </van-swipe-item>-->
        <!--            </van-swipe>-->
        <!--        </div>-->
        <!--  activeTab 不根据索引匹配，根据名称匹配-->
        <van-tabs
                v-model="activeTab"
                color="#1989FA"
                title-active-color="#1989FA"
                @change="handleTabChange"
        >
            <!-- 标签页 -->
            <van-tab
                    title="综合"
                    name="a"
            >
                <van-grid
                        :border="false"
                        :column-num="2"
                >
                    <van-grid-item
                            v-for="product in products"
                            :key="product.productId"
                            @click="goCommodity(product)"
                    >

                        <div style="width: 100%;height: 180px">
                            <img :src="product.picture" style="width: 100%;height: 180px" alt="">
                        </div>


                        <div style="text-align: left; width: 100%; margin: 8px; height: 40px">
                            {{product.productName}}
                        </div>
                        <!-- 如果启动积分 并且现价大于0 那么显示该布局 -->
                        <span
                                style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left: -29px;
                    top: -7px;"
                                v-if="product.integralEnabled == 0 && product.newPrice>0"
                        >
                <span style="font-size: 22px">{{ product.integral }}</span>积分+￥
                <span style="font-size: 22px;
                          position: relative;
                          left: -7px;">
                  {{ product.newPrice }}</span>
              </span>
                        <!-- 如果现价小于0显示该布局 -->
                        <span
                                style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;"
                                v-else-if="product.newPrice<=0"
                        >
                <span style="font-size: 22px">{{ product.integral }}</span>积分
              </span>
                        <!-- 如果不启用积分 就使用该布局 -->
                        <span
                                style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;"
                                v-else
                        >
                ￥<span style="font-size: 22px">{{ product.newPrice }}</span>
              </span>
                        <div style="margin: 8px; width: 100%">
                <span style="
                      font-size: 14px;
                      color: gray;
                      text-decoration: line-through;
                      display: block;
                      float: left;
                    ">￥{{product.loadPrice}}</span>
                            <span style="display: block; float: right">月销{{product.monthlySales}}</span>
                        </div>
                        <div style="text-align: left; width: 100%; margin: 8px; height: 30px">
                            {{product.storeName}}&nbsp;&nbsp;<van-icon name="arrow"/>
                        </div>
                    </van-grid-item>
                </van-grid>
            </van-tab>
            <van-tab
                    title="销量"
                    name="b"
            >
                <van-grid
                        :border="false"
                        :column-num="2"
                >
                    <van-grid-item
                            v-for="product in products"
                            :key="product.productId"
                            @click="goCommodity(product)"
                    >
                        <!--                        <van-image :src="product.picture"/>-->
                        <div style="width: 100%;height: 180px">
                            <img :src="product.picture" style="width: 100%;height: 180px" alt="">
                        </div>
                        <div style="text-align: left; width: 100%; margin: 8px; height: 40px">
                            {{product.productName}}
                        </div>
                        <!-- 如果启动积分 并且现价大于0 那么显示该布局 -->
                        <span
                                style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left: -29px;
                    top: -7px;"
                                v-if="product.integralEnabled == 0 && product.newPrice>0"
                        >
                <span style="font-size: 22px">{{ product.integral }}</span>积分+￥
                <span style="font-size: 22px;
                          position: relative;
                          left: -7px;">
                  {{ product.newPrice }}</span>
              </span>
                        <!-- 如果现价小于0显示该布局 -->
                        <span
                                style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;"
                                v-else-if="product.newPrice<=0"
                        >
                <span style="font-size: 22px">{{ product.integral }}</span>积分
              </span>
                        <!-- 如果不启用积分 就使用该布局 -->
                        <span
                                style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;"
                                v-else
                        >
                ￥<span style="font-size: 22px">{{ product.newPrice }}</span>
              </span>
                        <div style="margin: 8px; width: 100%">
                <span style="
                      font-size: 14px;
                      color: gray;
                      text-decoration: line-through;
                      display: block;
                      float: left;
                    ">￥{{product.loadPrice}}</span>
                            <span style="display: block; float: right">月销{{product.monthlySales}}</span>
                        </div>

                        <div style="text-align: left; width: 100%; margin: 8px; height: 30px">
                            {{product.storeName}}&nbsp;&nbsp;<van-icon name="arrow"/>
                        </div>
                    </van-grid-item>
                </van-grid>
            </van-tab>
            <van-tab
                    title="价格"
                    name="c"
                    @change="handleTabChange"
            >
                <template #title>
                    <div class="tab-title">
                        <span>价格</span>
                        <van-icon
                                class="tab-icon"
                                :name="sortDirection ? 'arrow-up' : 'arrow-down'"
                                @click="handleIconClick"
                        />
                    </div>
                </template>
                <div class="tab-content">
                    <van-grid
                            :border="false"
                            :column-num="2"
                    >
                        <van-grid-item
                                v-for="product in products"
                                :key="product.productId"
                                @click="goCommodity(product)"
                        >

                            <div style="width: 100%;height: 180px">
                                <img :src="product.picture" style="width: 100%;height: 180px" alt="">
                            </div>

                            <div style="text-align: left; width: 100%; margin: 8px; height: 40px">
                                {{product.productName}}
                            </div>
                            <!-- 如果启动积分 并且现价大于0 那么显示该布局 -->
                            <span
                                    style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left: -29px;
                    top: -7px;"
                                    v-if="product.integralEnabled == 0 && product.newPrice>0"
                            >
                <span style="font-size: 22px">{{ product.integral }}</span>积分+￥
                <span style="font-size: 22px;
                          position: relative;
                          left: -7px;">
                  {{ product.newPrice }}</span>
              </span>
                            <!-- 如果现价小于0显示该布局 -->
                            <span
                                    style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;"
                                    v-else-if="product.newPrice<=0"
                            >
                <span style="font-size: 22px">{{ product.integral }}</span>积分
              </span>
                            <!-- 如果不启用积分 就使用该布局 -->
                            <span
                                    style="text-align: left;
                    margin: -11px;
                    color: red;
                    position: relative;
                    left:-61px;
                    top: -7px;"
                                    v-else
                            >
                ￥<span style="font-size: 22px">{{ product.newPrice }}</span>
              </span>
                            <div style="margin: 8px; width: 100%">
                <span style="
                      font-size: 14px;
                      color: gray;
                      text-decoration: line-through;
                      display: block;
                      float: left;
                    ">￥{{product.loadPrice}}</span>
                                <span style="display: block; float: right">月销{{product.monthlySales}}</span>
                            </div>

                            <div style="text-align: left; width: 100%; margin: 8px; height: 30px">
                                {{product.storeName}}&nbsp;&nbsp;<van-icon name="arrow"/>
                            </div>
                        </van-grid-item>
                    </van-grid>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    export default {
        name: "StoreCheck",
        data() {
            return {
                images: [
                    require("@/assets/img/carousel/商城轮播图片3.png"),
                    require("@/assets/img/carousel/门店图片轮播3.png"),
                    require("@/assets/img/carousel/门店轮播图片1.png"),
                ],
                activeTab: "",
                product: {storeId: ''}, //存放从商品页面拿到的门店信息
                products: [],
                storeimage: "", //给门店图片赋值
                sortDirection: true, // 默认升序
                evaluate: {}, //门店评价星级
                selectPeopleAndRating: {
                    collectPeople: 0,//收藏人数
                    rating: '',
                },
                productName: '',
                priceOrder: "",
            }
        },
        created() {
            this.optionProductByStoreId();
        },
        methods: {
            //搜索框查询时间 当点击回车 或者在手机键盘中点击搜索触发
            onSearch() {
                this.optionProductByStoreId();
            },
            //点击价格图标事件
            handleIconClick() {
                // 切换排序方向
                this.sortDirection = !this.sortDirection;
                // 新建排序函数
                const compareFunction = (a, b) => {
                    // 如果a和b都有new_price，则按new_price排序
                    if (a.new_price && b.new_price && a.new_price !== null && a.new_price !== 0 && b.new_price !== null && b.new_price !== 0) {
                        if (this.sortDirection) {
                            return a.new_price - b.new_price;
                        } else {
                            return b.new_price - a.new_price;
                        }
                    }
                    // 如果a没有new_price，但b有new_price，则把a排在后面
                    else if (!a.new_price && b.new_price && b.new_price !== null && b.new_price !== 0) {
                        if (this.sortDirection) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                    // 如果a有new_price，但b没有new_price，则把b排在后面
                    else if (a.new_price && (!b.new_price || b.new_price === null || b.new_price === 0)) {
                        if (this.sortDirection) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    // 如果a和b都没有new_price但有integral，则按integral排序
                    else if (a.integral && b.integral) {
                        if (this.sortDirection) {
                            return a.integral - b.integral;
                        } else {
                            return b.integral - a.integral;
                        }
                    }
                    // 如果a没有new_price，也没有integral，则把a排在后面
                    else if (!a.new_price && !b.new_price && (!a.integral || !b.integral)) {
                        if (this.sortDirection) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                    // 如果b没有new_price，也没有integral，则把b排在后面
                    else if (!b.new_price && !a.new_price && (!a.integral || !b.integral)) {
                        if (this.sortDirection) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    // 如果代码执行到这里，意味着a和b都有new_price但其中至少一个为0/null，按integral排序
                    else {
                        if (this.sortDirection) {
                            return a.integral - b.integral;
                        } else {
                            return b.integral - a.integral;
                        }
                    }
                };
                // 用新的排序函数重新排序
                this.products.sort(compareFunction);
            },


            //点击标签时，拿到商品类型id查询到该类型的商品
            handleTabChange(name) {
                //如果标签为综合查询，就根据当前门店查所有
                if (name == "a") {
                    //清空顺序标识
                    this.priceOrder = "";
                    this.optionProductByStoreId();
                } else if (name == "c") {
                    //判断this.product.priceOrder的值
                    if (this.priceOrder == "") {
                        //改为降序 避免点击完其他tab后，没有点到图标，而是点到tab查询的
                        this.sortDirection = true;
                    }
                    //标签为价格标签，默认按升序
                    //判断priceOrder是1还是0  1 是倒序 0是正序
                    this.optionProductByStoreId();
                } else if ((name = "b")) {
                    //根据销量查询
                    this.priceOrder = 2;
                    this.optionProductByStoreId();
                }
            },

            optionProductByStoreId() {
                //拿到上个页面传过来的参数
                const dataParam = this.$route.query.data;
                //将数据解析为对象或者数据
                if (dataParam) {
                    const storeIdData = JSON.parse(dataParam);
                    //给门店封面赋值
                    this.storeimage = storeIdData.storeimage
                    //给门店评分赋值
                    this.selectPeopleAndRating.rating=storeIdData.averageStar
                    this.$http.post("/product/mobile/store/api/selectProductAndStoreNameByStoreId?productName=" + this.productName + "&storeId=" + storeIdData.storeId)
                        .then(response => {
                            this.products = response.data.data;
                            //执行查询门店星级
                            this.selectPeopleAndRatingByStoreId();
                        })
                }
            },
            //拿到店铺的星级
            selectPeopleAndRatingByStoreId() {
                const data = this.$route.query.data;
                if (data) {
                    const product = JSON.parse(data);
                    this.product = product;
                }
                this.$http.post("/product/mobile/store/api/selectStoreNameAndRatingByStoreName?storeName=" + this.product.storeName)
                    .then(resp => {
                        this.selectPeopleAndRating = resp.data.data;
                    })
            },
            //加盟开店
            Dialog() {
                this.$dialog
                    .confirm({
                        title: "提示",
                        message: "请拨打电话 4000999747",
                        confirmButtonColor: "red",
                    })
                    .then(() => {
                        console.log("确认");
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
            //跳转商城页面
            goStore() {
                //  go(-1):返回上一级路由
                this.$router.go(-1);
            },
            //跳转商品页面
            goCommodity(product) {
                //  路径/store对应router目录下index.js中定义的path属性值
                this.$router.push({
                    path: "/SingleCommodity",
                    query: {
                        data: JSON.stringify(product),
                    },
                });
            },

        }
    }
</script>

<style scoped>
</style>