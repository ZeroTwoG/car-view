<template>

    <div id="evaluateDetail">
        <div style="z-index: 1">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <!-- 粘性布局 -->
                <van-sticky>
                    <!-- 导航栏 -->
                    <van-nav-bar title="全部评价" left-arrow @click-left="onClickLeft" />
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
                <hr />
                <div v-for="item in evaluateDetail">
                    <van-row style="margin-top: 20px; font-size: 12px">
                        <van-col span="4">
                            <van-image round width="2rem" height="2rem" :src="item.avatar" style="margin-left: 25px" />
                        </van-col>
                        <van-col span="14">
                            <van-row>
                                {{ item.userName }}
                            </van-row>
                            <van-row>
                                <van-rate size="10px" allow-half v-model="item.star" readonly
                                    color="rgb(255, 167, 56)" />
                            </van-row>
                        </van-col>
                        <van-col span="4" style="color: #999">
                            {{ item.evaluateTime }}
                        </van-col>
                    </van-row>
                    <van-row style="margin-left: 30px;margin-top: 10px;padding-bottom: 5px">
                        <van-col span="20">
                            {{ item.content }}
                        </van-col>
                    </van-row>
                    <van-row style="margin-left: 30px;">
                        <van-image style="width: 100px;height: 100px" v-if="item.picture !== '' & item.picture != null"
                            :src="item.picture"></van-image>
                    </van-row>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

export default {
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data() {
        return {
            evaluateDetail: [],
            storeId: '',
            //评分
            detail: [],
            isLoading: false, //刷新参数
        }
    },
    created() {
        this.storeId = this.$route.query.storeId;
        this.selectStoreEvaluate(this.storeId)
    },
    methods: {
        //通过storeId查询评分
        selectStoreEvaluate(storeId) {
            axios.post("http://172.16.7.55:7011/nearShop/storeEvaluate/selectCommentsVoByStoreId?storeId=" + storeId).then(resp => {
                this.evaluateDetail = resp.data.data;
                this.detail = resp.data.data;
                console.log(this.evaluateDetail);

                this.allCom();
            })
        },
        //刷新方法
        onRefresh() {
            setTimeout(() => {
                Toast("刷新成功");
                this.isLoading = false;
                //调用请求
            }, 1000);
        },
        //全部评论
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
                return item.picture != null & item.picture !== "";
            });

        },
        //好评
        greatCom() {
            this.evaluateDetail = this.detail;
            let all = document.querySelectorAll('.bu');
            all.forEach(function (element) {
                element.style.backgroundColor = '#F8F8F8';
                element.style.border = '1px solid #F8F8F8';
            });
            let firstElement = document.querySelectorAll('.bu')[2];
            firstElement.style.backgroundColor = '#E5F5FD';
            firstElement.style.border = '1px solid #019FE8';
            this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                return item.star >= 4;
            });

        },
        //中评
        mCom() {
            this.evaluateDetail = this.detail;
            let all = document.querySelectorAll('.bu');
            all.forEach(function (element) {
                element.style.backgroundColor = '#F8F8F8';
                element.style.border = '1px solid #F8F8F8';
            });
            let firstElement = document.querySelectorAll('.bu')[3];
            firstElement.style.backgroundColor = '#E5F5FD';
            firstElement.style.border = '1px solid #019FE8';
            this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                return item.star < 4 & item.star > 1;
            });
        },
        //差评
        badCom() {
            this.evaluateDetail = this.detail;
            let all = document.querySelectorAll('.bu');
            all.forEach(function (element) {
                element.style.backgroundColor = '#F8F8F8';
                element.style.border = '1px solid #F8F8F8';
            });
            let firstElement = document.querySelectorAll('.bu')[4];
            firstElement.style.backgroundColor = '#E5F5FD';
            firstElement.style.border = '1px solid #019FE8';
            this.evaluateDetail = this.evaluateDetail.filter(function (item) {
                return item.star < 2;
            });
        },
    },
}
</script>
<style scoped>
.bu {
    margin-right: 10px;
    background-color: #F8F8F8;
    border: 1px solid #F8F8F8;
    border-radius: 45px;
    /* 可以调整圆角的大小，根据需要进行修改 */
    padding: 7px 14px;
    /* 可以根据按钮内容和设计进行调整 */
    font-size: 13px;
}

hr {
    /*color: #999;*/
    background-color: #F6F7F9;
    height: 8px;
    border: none;
}
</style>