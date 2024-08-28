<template>
    <div>
        <van-sticky>
            <van-nav-bar title="收货地址" left-arrow @click-left="onClickLeft" />
        </van-sticky>
        <van-address-list @select="selecteAddress" v-model="chosenAddressId" :list="allAddress" default-tag-text="默认"
            @add="onAdd" @edit="onEdit" />
    </div>
</template>

<script>
import axios from "axios";
import { Toast } from "vant";
import { AddressEdit } from "vant";

export default {
    data() {
        return {
            chosenAddressId: 0,
            allAddress: [], //存放查询出来的收货地址
            userId: "",
        };
    },
    created() {
        //获取地址列表传的地址id
        this.userId = this.$route.query.userId;
        this.initAddress();
    },
    methods: {
        initAddress() {
            axios.get("/my/userAddress/selectAddressById/" + this.userId).then((res => {
                if (res.data.code === 200) {
                    let tempAddress = res.data.data;
                    for (let i = 0; i < tempAddress.length; i++) {
                        let b = false; //是否是默认地址
                        if (tempAddress[i].flag === "0") {
                            b = true;
                            this.chosenAddressId = tempAddress[i].addressId;
                        }
                        //把查询出来的地址内容赋值给变量a
                        //详细地址（省 市 县(区) 详细信息）
                        let myAdd = "";
                        if (tempAddress[i].province === tempAddress[i].city) {
                            myAdd = tempAddress[i].city + tempAddress[i].district + " " + tempAddress[i].detail;
                        } else {
                            myAdd = tempAddress[i].province + tempAddress[i].city + tempAddress[i].district + " " + tempAddress[i].detail;
                        }
                        let a = {
                            id: tempAddress[i].addressId,
                            name: tempAddress[i].addressName,
                            tel: tempAddress[i].phone,
                            address: myAdd,
                            isDefault: b,
                            userId: tempAddress[i].userId,
                        };
                        this.allAddress.push(a);
                    }
                }
            })).catch(function (error) {
                console.log("出错了。。。" + error);
            })
        },
        //添加地址
        onAdd() {
            this.$router.push({
                path: "/addressEdit",
                query: { userId: this.userId },
            });
        },
        //编辑地址
        onEdit(item, index) {
            let id = this.allAddress[index].id; //地址id
            this.$router.push({
                path: "/addressEdit",
                query: { id: id, userId: this.allAddress[0].userId },
            });
        },
        //将选取的地址信息返回到下单选择的地址中
        selecteAddress(index) {
            //index：当前页面传过去的参数
            localStorage.setItem("myAddress", JSON.stringify(index))
        },
        onClickLeft() {
            this.$router.go(-1);
        },
    }
}
</script>
<style scoped></style>
