<template>
    <!-- 书写html结构 只可以有一个div 但是可以嵌套多个div -->
    <div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar title="添加车辆" left-arrow @click-left="onClickLeft" />
                <!-- 标题 -->
            </van-sticky>

            <!-- 搜索框 -->
            <van-row style="margin-top: 9px">
                <van-col span="21">
                    <van-search v-model="selectMsg.storeName" shape="round" placeholder="搜索关键词" />
                </van-col>
                <van-col span="3" style="margin-top: 15px; text-align: left; font-size: 24px"><van-icon name="search"
                        @click="selectAllStore" /></van-col>
            </van-row>

            <!-- 列出店铺信息 -->
            <div v-for="item in storeInfo" style="margin-left: 15px;margin-right: 15px" :key="item.storeId">
                <van-radio-group v-model="radio">
                    <van-radio style="margin-top: 18px; margin-bottom: 18px" :name="item.storeId">{{ item.storeName
                        }}</van-radio>
                    <div style="background: #f6f6f6; height: 1px"></div>
                    <!-- 确定按钮 -->
                    <van-tabbar style="height: 8%">
                        <van-col span="24"><van-button round type="info" style="width: 100%"
                                @click="chooseStore(radio)">确定</van-button></van-col>
                    </van-tabbar>
                </van-radio-group>
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
            isLoading: false, //刷新参数
            storeInfo: [], //存放店铺信息
            radio: "", //单框的双向绑定
            returnStoreName: "", //确定选择的门店后，返回的门店名称
            selectMsg: {
                storeName: ''
            },//查询的数据

        };
    },
    //初始化数据
    created() {
        this.selectAllStore();
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
        //查询门店信息
        selectAllStore() {
            axios.post("/mainPage/store/searchStore?storeName=" + this.selectMsg.storeName).then(resp => {
                this.storeInfo = resp.data.data;
            })
                .catch(function (error) {
                    console.log(error);
                });
        },

        //确定选择的门店
        chooseStore(radio) {
            //跳转页面时传参
            this.$router.push({
                path: "/BindCar",
                query: { storeId: radio },
            });
        },
    },
    //声明注解
    components: {},
};
</script>
<style scoped></style>
