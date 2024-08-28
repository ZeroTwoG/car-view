<template>
    <!-- 书写html结构 -->
    <div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar title="选择车辆" left-arrow @click-left="onClickLeft" />
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
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
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
                storeId: '',
                stationId: '',
                carId: '',
                carNo: ''
            }//传到后台的数据
        };
    },
    created() {
        this.form.storeId = this.$route.query.storeId;
        this.form.stationId = this.$route.query.stationId;
        this.form.userId = this.$route.query.userId;
        this.selectByToken(this.form);
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
        //根据token,和门店id查询当前登录用户的添加的车辆
        selectByToken(form) {
            axios.post("/mainPage/car/selectBindCar?storeId=" + form.storeId + "&userId=" + form.userId).then(resp => {
                this.carList = resp.data.data;
                if (this.carList.length == 0) {
                    this.record = "该门店没有可洗车车辆，请添加车辆"
                }
            })
        },

        //点击确定按钮，提示是否给这辆车洗车
        ifChooseCar(radio) {
            Dialog.confirm({
                title: "提示",
                message: "确定给车牌   " + radio.carNo + "   的车辆洗车?",
            }).then(resp => {
                this.form.carId = radio.carId;
                this.form.carNo = radio.carNo;
                axios.post("http://172.16.7.55:7011/nearShop/carWashRecord/insertCarWahRecord", this.form).then(resp => {
                    if (resp.data.code == 200) {
                        Dialog.alert({
                            title: "提示",
                            message:
                                "已开始洗车，计费已开始，可在首页点击结算开门进行结束洗车",
                        }).then(() => {
                            //跳转首页,携带参数
                            this.$router.push({
                                path: "/home",
                            });
                        });
                    }
                })
            }).catch(() => {
            });
        },
    },
};
</script>
