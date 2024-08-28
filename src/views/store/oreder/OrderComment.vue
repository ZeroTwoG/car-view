<template>
    <div>

        <van-sticky>
            <van-nav-bar
                    style="height: 65px"
                    title="评价"
                    left-arrow
                    @click-left="onClickLeft"
            />
        </van-sticky>


        <van-field name="rate">
            <template #input>
                <van-image
                        width="10rem"
                        height="10rem"
                        :src="productOrder.picture"
                />
                <p>{{ productOrder.productName }}</p>
            </template>
        </van-field>

        <van-field name="rate" label="商品评价">
            <template #input>
                <van-rate v-model="rate" />
            </template>
        </van-field>

        <van-field
                v-model="message"
                rows="3"
                autosize
                label=""
                type="textarea"
                placeholder="请输入您对商品的评价"
        />

        <van-field name="checkbox">
            <template #input>
                <van-checkbox v-model="checkbox">匿名评价</van-checkbox>
            </template>
        </van-field>

        <van-button round class="btn" type="submit" @click="commitReview()"
                    v-if="productOrder.statusCode!=6"
        >提交</van-button
        >
    </div>
</template>

<script>
    import { Toast } from 'vant';
    export default {

        name: "Comment",
        data() {
            return {
                rate: 5,
                fileList: [],
                checkbox: false,
                message:"",
                productOrder: {}, //订单对象
                userId: "", //当前用户id
                statusCode: "", //支付状态码
            };
        },
        created() {
            const dataParam = JSON.parse(this.$route.query.data);
            if (dataParam) {
                this.productOrder = dataParam;
                console.log(this.productOrder)
            }

        },

        methods: {
            onClickLeft() {
                //返回
                this.$router.push('/unpaid?statusCode=43')

            },

            //添加评价
            commitReview() {

                this.$axios.post("/store/order/insertComment", {
                        productId: this.productOrder.productId,
                        userId: this.checkbox?0:this.productOrder.userId,
                        content: this.message,
                        rating: this.rate,
                        orderId: this.productOrder.id
                    })
                    .then((response)=>{
                      console.log(response.data)
                        if (response.data.code==200){
                          this.onClickLeft();
                        }else {
                          Toast.fail(response.data.msg);
                          this.onClickLeft();
                        }
                    }).catch({
                })
            },
        },
    }
</script>

<style scoped>
    p {
        margin: 0px;
        margin-bottom: 136px;
        margin-left: 10px;
    }
    .btn {
        width: 92%;
        color: white;
        font-size: 16px;
        background-color: rgb(1, 159, 232);
        border: 0px;
        margin-top: 100px;
    }
</style>