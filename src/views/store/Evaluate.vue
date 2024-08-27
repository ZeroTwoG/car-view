<template>
    <div id="evaluateDetail">
        <div style="z-index: 1">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <!-- 粘性布局 -->
                <van-sticky>
                    <!-- 导航栏 -->
                    <van-nav-bar
                            title="全部评价"
                            left-arrow
                            @click-left="onClickLeft"
                    />
                    <!-- 标题 -->
                </van-sticky>
                <div id="butt">
                    <van-row style="margin-top: 20px;margin-left: 10px;padding-bottom: 15px">
                        <van-col>
                            <a class="bu" @click="allCom" style="width: 70px" type="default">全部</a>
                        </van-col>
                        <van-col>
                            <a class="bu" @click="havePic" style="width: 70px" type="default">有图</a>
                        </van-col>
                        <van-col>
                            <a class="bu" @click="greatCom" style="width: 70px" type="default">好评</a>
                        </van-col>
                        <van-col>
                            <a class="bu" @click="mCom" style="width: 70px" type="default">中评</a>
                        </van-col>
                        <van-col>
                            <a class="bu" @click="badCom" style="width: 70px" type="default">差评</a>
                        </van-col>
                    </van-row>
                </div>
                <hr/>
                <div
                        v-for="item in evaluateDetail"
                >
                    <van-row style="margin-top: 20px; font-size: 12px">
                        <van-col
                                span="4">
                            <van-image round
                                       width="2rem"
                                       height="2rem"
                                       :src="item.imageUrl"
                                       style="margin-left: 25px"/>
                        </van-col>
                        <van-col
                                span="14">
                            <van-row>
                                {{item.userName}}
                            </van-row>
                            <van-row>
                                <van-rate size="10px"
                                          allow-half
                                          v-model="item.rating"
                                          readonly
                                          color="rgb(255, 167, 56)"
                                />
                            </van-row>
                        </van-col>
                        <van-col
                                span="4" style="color: #999">
                            {{item.evaluateTime}}
                        </van-col>
                    </van-row>
                    <van-row style="margin-left: 30px;margin-top: 10px;padding-bottom: 5px"
                    >
                        <van-col span="20">
                            {{item.content}}
                        </van-col>
                    </van-row>
                  <div v-if="item.img!==''&item.img!=null" v-for="items in item.img">
                    <van-row style="margin-left: 30px">
                      <img :src="items.imageUrl" width="90px" height="90px" style="border: 1px solid rgba(157,157,157,0.1);border-radius: 5px"/>
                    </van-row>
                  </div>

                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import axios from "axios";

    export default {
        name: "Evaluate",
        setup() {
            const onClickLeft = () => history.back();
            return {
                onClickLeft,
            };
        },
        data() {
            return {
                count: 0,
                productReviews: {}, //查询到的评论
                review: { productId: "", reviewType: "", onlyWithImages: false },
                ReviewTypeCount:{},//商品评价类型的数量
                ReviewImageCount:{},//商品带图片的数量
                total: 0,//评论总数量


                evaluateDetail: [],//用来遍历获取里面所有的的参数
                productId: '',
                //评分
                detail: [],//用来接收对应productId的值
                isLoading: false, //刷新参数
                imageUrlss: require("../../assets/img/1.png"),

            }
        },
        created() {
            this.productId = this.$route.query.data;
            this.selectProductEvaluate(this.productId)
            this.allCom();
            this.havePic();
            this.greatCom();
            this.mCom();
            this.badCom();
            this.onRefresh();
        },
        methods: {

            //通过productId查询评分ok
            selectProductEvaluate(productId) {
              console.log("productId:",productId)
              this.$axios.post(`/store/evaluate/selectTbProduckreviewByProductId/${productId}`).then(resp => {
                    let datas = resp.data.data;
                    console.log(datas)
                //伪实体vo
                    for (let i = 0; i < datas.length; i++){
                      datas[i].userName=datas[i].user.userName;
                      datas[i].imageUrl=datas[i].user.avatar;
                      datas[i].evaluateTime=datas[i].text.createTime;
                      datas[i].content=datas[i].text.content;
                      datas[i].imageUrlss=datas[i].image;
                      datas[i].rating=datas[i].text.rating;
                    }
                    this.evaluateDetail=datas;
                    this.detail = datas;
                    this.allCom();
                })
            },
            // //全部评论
            allCom() {
                let all = document.querySelectorAll('.bu');
                all.forEach(function (element) {
                    element.style.backgroundColor = '#F8F8F8';
                    element.style.border = '1px solid #F8F8F8';
                });
                let firstElement = document.querySelectorAll('.bu')[0];
                firstElement.style.backgroundColor = '#E5F5FD';
                firstElement.style.border = '1px solid #019FE8';
                this.evaluateDetail = this.detail;
            },
            //有图
            havePic() {
                this.evaluateDetail = this.detail;
                let all = document.querySelectorAll('.bu');
                all.forEach(function (element) {
                    element.style.backgroundColor = '#F8F8F8';
                    element.style.border = '1px solid #F8F8F8';
                });
                let firstElement = document.querySelectorAll('.bu')[1];
                firstElement.style.backgroundColor = '#E5F5FD';
                firstElement.style.border = '1px solid #019FE8';
                this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                    return item.img[0] != null && item.img[0] !== "";
                });
            },
            //好评
            greatCom() {
                this.evaluateDetail = this.detail;
                // this.selectProductEvaluate(this.productId);
                let all = document.querySelectorAll('.bu');
                all.forEach(function (element) {
                    element.style.backgroundColor = '#F8F8F8';
                    element.style.border = '1px solid #F8F8F8';
                });
                let firstElement = document.querySelectorAll('.bu')[2];
                firstElement.style.backgroundColor = '#E5F5FD';
                firstElement.style.border = '1px solid #019FE8';
                this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                    return item.rating >= 4;
                });
            },
            //中评
            mCom() {
                this.evaluateDetail = this.detail;
                // this.selectProductEvaluate(this.productId);
                let all = document.querySelectorAll('.bu');
                all.forEach(function (element) {
                    element.style.backgroundColor = '#F8F8F8';
                    element.style.border = '1px solid #F8F8F8';
                });
                let firstElement = document.querySelectorAll('.bu')[3];
                firstElement.style.backgroundColor = '#E5F5FD';
                firstElement.style.border = '1px solid #019FE8';
                this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                    return item.rating < 4 & item.rating > 2;
                });
            },
            //差评
            badCom() {
                this.evaluateDetail = this.detail;
                // this.selectProductEvaluate(this.productId);
                let all = document.querySelectorAll('.bu');
                all.forEach(function (element) {
                    element.style.backgroundColor = '#F8F8F8';
                    element.style.border = '1px solid #F8F8F8';
                });
                let firstElement = document.querySelectorAll('.bu')[4];
                firstElement.style.backgroundColor = '#E5F5FD';
                firstElement.style.border = '1px solid #019FE8';
                this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                    return item.rating <= 2;
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
        }


    }


</script>

<style scoped>
    .bu {
        margin-right: 10px;
        background-color: #F8F8F8;
        border: 1px solid #F8F8F8;
        border-radius: 45px; /* 可以调整圆角的大小，根据需要进行修改 */
        padding: 7px 14px; /* 可以根据按钮内容和设计进行调整 */
        font-size: 13px;
    }

    hr {
        /*color: #999;*/
        background-color: #F6F7F9;
        height: 8px;
        border: none;
    }
</style>