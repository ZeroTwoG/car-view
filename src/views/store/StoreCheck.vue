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
                        :src="selectPeopleAndRating.storeImg"
                        radius="8px"
                        style="float: left"
                ></van-image>
                <div style="margin-left: 85px">
                    <div style="display: flex; align-items: center; margin: 10px 0;">
                        <div style="flex-grow: 1; margin-top: -22px">
                            {{ selectPeopleAndRating.storeName }}
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
<!--          activeTab 不根据索引匹配，根据名称匹配-->
        <van-tabs
                v-model="activeTab"
                color="#1989FA"
                title-active-color="#1989FA"
                @change="handleTabChange"
                name="a"
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
                    @change="handleTabChange"
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
                                @click="priceSort"
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
            this.selectPeopleAndRatingByStoreId();
        },
        methods: {
            //搜索框查询时间 当点击回车 或者在手机键盘中点击搜索触发
            onSearch() {
                this.optionProductByStoreId();
            },
          //点击标签时，拿到商品类型id查询到该类型的商品
          handleTabChange(name) {
              console.log("标签切换")
            console.log(name)
              //如果标签为综合查询，就根据当前门店查所有
              if (name == "a") {
              //重新查询(恢复默认)
              this.optionProductByStoreId();
              } else if (name == "b") {
                //根据销量查询
                this.numSort()
              } else if (name = "c") {
                //标签为价格标签，默认按升序
                this.priceSort();
              }
          },
          //点击价格图标事件
          priceSort() {
            console.log("价格排序")
            // 切换排序方向
            this.sortDirection = !this.sortDirection;
            // 用新的排序函数重新排序
            this.products.sort(( a, b) => {
              let as = (a!=null&&a.newPrice>0)?a.newPrice:"0."+a.integral;
              let bs = (b!=null&&b.newPrice>0)?b.newPrice:"0."+b.integral;
              if(this.sortDirection){
                return as-bs;
              }else{
                return bs-as;
              }
            });
          },
          //点击销量图标事件
          numSort(){
            console.log("销量排序")
            this.products.sort(( a, b) => {
                return b.monthlySales-a.monthlySales;
            });
          },
          //查询门店评价星级
            optionProductByStoreId() {
                // 拿到上个页面传过来的参数
                const dataParam = this.$route.query.data;
                //将数据解析为对象或者数据
                if (dataParam) {
                    const storeIdData = JSON.parse(dataParam);
                    //给门店封面赋值
                    this.storeimage = storeIdData.storeimage
                    //给门店评分赋值
                    this.selectPeopleAndRating.rating=storeIdData.averageStar
                  console.log(storeIdData.storeId)
                  //查询商品列表
                    this.$axios.get("/store/check/selectAllProduckByStoreIdOrProductName?productName=" + this.productName + "&storeId=" + storeIdData.storeId)
                        .then(response => {
                            this.products = response.data.data;
                          console.log("商品列表")
                          console.log(this.products)
                            //执行查询门店星级
                        })
                }
            },
            //拿到店铺的星级
            selectPeopleAndRatingByStoreId() {
                const data = this.$route.query.data;
              console.log("店铺")
                if (data) {
                    const product = JSON.parse(data);
                    this.product = product;
                  console.log(product)
                }
                this.$axios.get(`/store/product/selectTbStoreEvaluate/${this.product.storeId}`)
                    .then(resp => {
                      console.log("商店:::"+resp.data)
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