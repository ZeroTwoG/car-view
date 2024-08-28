<template>
    <div>
        <van-sticky>
            <van-nav-bar
                    style="height: 65px"
                    title="订单详情"
                    left-arrow
                    @click-left="onClickLeft"
            />
        </van-sticky>



        <van-row>
            <van-col span="24">
                <van-card :num="productOrder.productCount" :price="productOrder.newPrice">
                    <van-image
                            slot="thumb"
                            width="100%"
                            height="10rem"
                            fit="cover"
                            :src="productOrder.picture"
                    />
                    <div slot="title">{{ productOrder.productName }}</div>
                    <div slot="desc">{{ productOrder.storeName }}</div>
                </van-card>
            </van-col>
        </van-row>


        <van-cell-group>
            <van-cell title="商品单价" :value="productOrder.newPrice" />
            <van-cell title="购买数量" :value="productOrder.productCount" />
            <van-cell title="使用积分" :value="productOrder.totalIntegral" />
            <van-cell title="运费" :value="productOrder.totalAmount-(productOrder.newPrice*productOrder.productCount)" />
            <van-cell title="订单号" :value="productOrder.orderNo" />
            <van-cell title="下单店铺" :value="productOrder.storeName" />
            <van-cell title="实付金额" :value="productOrder.totalAmount" />
            <van-cell title="支付时间" :value="productOrder.payTime" />
            <van-cell title="创建时间" :value="productOrder.createTime" />
        </van-cell-group>


    </div>
</template>

<script>
    export default {
        name: "OrderDetailed",
        setup() {
            const onClickLeft = () => history.back();
            return {
                onClickLeft,
            };
        },
        data(){
            return{
                productOrder: {}, //订单对象
                userId: "", //当前用户id
                statusCode: "", //支付状态码
            }
        },
        created() {
            const dataParam = JSON.parse(this.$route.query.data);
            if (dataParam) {
                this.productOrder = dataParam;
                console.log(this.productOrder)
            }

        },
    }
</script>

<style scoped>

</style>