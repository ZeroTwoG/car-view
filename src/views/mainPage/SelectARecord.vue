<template>
    <!-- 书写html结构 -->
    <div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar title="洗车详情" left-text="返回" left-arrow @click-left="jump('home')" />
            </van-sticky>
            <p>{{ record }}</p>
            <van-row style="margin-top: 10px; padding-left: 15px;padding-right: 15px; text-align: left"
                v-for="item in carList" :key="item.carNo">
                <van-col span="24">
                    <van-radio-group v-model="radio">
                        <van-radio style="
              margin-top: 18px;
              margin-bottom: 18px;
              font-size: 23px;
              font-weight: normal;" :name="item">
                            &nbsp;{{ item.carNo }}
                        </van-radio>
                        <div style="background: #f6f6f6; height: 1px"></div>
                        <!-- 确定按钮 -->
                        <van-tabbar style="height: 15%">
                            <van-col span="24">
                                <van-button round type="info" style="width: 100%" @click="ifChooseCar(radio)">确定
                                </van-button>
                            </van-col>
                        </van-tabbar>
                    </van-radio-group>
                </van-col>
            </van-row>

        </van-pull-refresh>
    </div>
</template>

<script>
import Vue from "vue";
import { Dialog, Toast } from "vant";
import axios from "axios";
//书写组件配置项目 相当于写js代码的地方
//要求template必须有且只有一个根元素，如果有两个就不知道绑定那个
export default {
    //export default 相当于过去的new vue ({el:"#div"})
    //全部都是json格式

    props: {
        //注册属性，用来父子组件传递参数使用
    },

    data() {
        //定义数据的地方
        return {
            record: '',
            isLoading: false, //刷新参数
            radio: "", //单框的双向绑定
            storeId: "", //门店id
            carList: [], //存放添加的车辆信息
            stationId: "", //工位id
            form: {
                userId: '',
            }//传到后台的数据
        };
    },
    created() {
        this.selectUser();
    },
    mounted() {
        // 生命周期  挂载完成后
    },
    methods: {
        //刷新方法
        onRefresh() {
            setTimeout(() => {
                Toast("刷新成功");
                this.isLoading = false;
                //调用请求
            }, 1000);
        },
        //获取用户信息
        selectUser() {
            axios.get("http://172.16.7.55:7011/mainPage/FrontUser/getUserInfo").then(res => {
                this.form.userId = res.data.data.userId;
                this.selectByToken();
            })
        },

        //根据token,和门店id查询当前登录用户的添加的车辆
        selectByToken() {
            axios.get("/store/washrecord/api/selectByUserId?userId=" + this.form.userId).then(resp => {
                this.carList = resp.data.data;
                if (this.carList.length == 0) {
                    this.record = "暂无车辆在清洗";
                }
            })
        },

        //点击确定按钮，提示是否给这辆车洗车
        ifChooseCar(radio) {
            console.log(radio, "--------------")
            this.$router.push({
                path: "/SettlementIsOpen",
                query: {
                    data: JSON.stringify(radio),
                },
            });
        },
        //  方法事件处理
        jump(uri) {
            this.$router.push(
                uri,
                () => { },
                () => { }
            );
        },
    },
};
</script>
