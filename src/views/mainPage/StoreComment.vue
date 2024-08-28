<template>
    <div>
        <van-nav-bar title="评价" left-text="" left-arrow @click-left="onClickLeft('CarWashCalendar')" />
        <van-row style="margin-top: 10px; margin-left: 9px; text-align: left">
            <van-col span="24" style="font-size: 20px; font-weight: 700; margin-left: 10px">
                <div style="margin-bottom: 10px">{{ storeName }}</div>
            </van-col>
        </van-row>
        <van-field name="rate" label="店铺评价">
            <template #input>
                <van-rate v-model="rate" />
            </template>
        </van-field>

        <van-field v-model="message" rows="3" autosize label="" type="textarea" placeholder="请输入您对门店的评价" />

        <div style="float: left; margin-left: 10px">
            <img :src="previewImage" v-if="previewImage" width="80px" height="80px" />
        </div>

        <!-- 添加文件输入框 -->
        <input type="file" @change="handleFileChange" accept="image/*" ref="fileInput" />
        <van-field name="checkbox">
            <template #input>
                <van-checkbox v-model="checkbox">匿名评价</van-checkbox>
            </template>
        </van-field>

        <van-button round class="btn" type="submit" @click="commitReview()">提交</van-button>
    </div>
</template>
<script>
import Vue from "vue";
import { Uploader, Rate, Field, Col, Row, NavBar, Checkbox, Button } from "vant";
import axios from "axios";

export default {
    data() {
        return {
            rate: 5, //店铺星级
            checkbox: true, //是否匿名,默认匿名
            storeName: "",
            message: "", //评价信息
            previewImage: "", //预览图片
            uploadResult: '', // 用于存储上传结果
            // 评价信息
            info: {
                storeId: "", //门店id
                userId: "", //用户id
                content: "", //评价内容
                evaluateTime: "", //评价时间
                picture: "", //评价图片
                star: "", //评价等级
                orderId: "", //洗车记录id
            },
        };
    },
    created() {
        this.storeName = this.$route.query.storeName;
        this.info.orderId = this.$route.query.orderId;
        this.info.userId = this.$route.query.userId;
        this.info.storeId = this.$route.query.storeId;
    },
    methods: {
        //1,返回上一级
        onClickLeft(uri) {
            this.$router.push(
                uri,
                () => { },
                () => { }
            );
        },

        //添加评价
        commitReview() {
            var _this = this;
            this.info.star = this.rate;
            this.info.content = this.message;
            if (this.info.content == "" && this.info.picture == "") {
                _this.$toast("请输入评价内容");
                return;
            }
            if (this.checkbox) {
                this.info.userId = 0;
            } else {
                this.info.userId = this.$route.query.userId;
            }
            console.log(this.info);

            axios.post("/mainPage/storeEvaluate/insertStoreEvaluate", this.info)
                .then(function (response) {
                    if (response.data.code == 200) {
                        _this.$toast("评价成功！");
                        _this.$router.push("/CarWashCalendar");
                    }
                })
                .catch(function (error) {
                });
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            // 创建一个读取文件的 FileReader 对象
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage = e.target.result; // 将读取的结果赋值给预览图片
            };
            reader.readAsDataURL(file); // 读取文件为 Data URL 格式

            // 创建 FormData 对象
            const formData = new FormData();
            formData.append('file', file);

            // 发送文件到后端
            axios.post('http://172.16.7.55:7011/common/menu/img', formData)
                .then(response => {
                    console.log('上传成功:', response.data);
                    this.info.picture = response.data; // 假设后端返回的图片URL在 data.url 中
                })
                .catch(error => {
                    console.error('上传失败:', error);
                    this.uploadResult = '上传失败';
                });
        },
        triggerFileSelect() {
            this.$refs.fileInput.click(); // 触发文件选择器
        },
    },
    components: {
        [NavBar.name]: NavBar,
        [Row.name]: Row,
        [Col.name]: Col,
        [Field.name]: Field,
        [Rate.name]: Rate,
        [Checkbox.name]: Checkbox,
        [Button.name]: Button,
    },
};
</script>
<style scoped>
p {
    margin: 0px;
    margin-bottom: 136px;
    margin-left: 10px;
}

.van-cell__title,
.van-cell__value {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
}

.van-cell__value {
    position: relative;
    overflow: hidden;
    color: #969799;
    vertical-align: middle;
    word-wrap: break-word;
    text-align: left;
}

.van-field__label {
    -webkit-box-flex: 0;
    -webkit-flex: none;
    flex: none;
    box-sizing: border-box;
    width: 6.2em;
    margin-right: 12px;
    color: #646566;
    text-align: left;
    word-wrap: break-word;
    font-weight: 700;
}

.btn {
    width: 100%;
    color: white;
    font-size: 16px;
    background-color: rgb(1, 159, 232);
    border: 0px;
    margin-top: 100px;
}
</style>