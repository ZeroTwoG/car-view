<template>
  <!-- 头部刷新 -->
    <div style="z-index: 1">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 粘性布局 -->
            <van-sticky>
                <!-- 导航栏 -->
                <van-nav-bar
                        title="位置信息"
                        left-arrow
                        @click-left="onClickLeft"
                />
                <!-- 标题 -->
            </van-sticky>
  <div id="map" style="width: 375px;height: 667px"></div>
        </van-pull-refresh>
    </div>

</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import {Toast} from "vant";
window._AMapSecurityConfig = {
    securityJsCode: '7971203447efcf714e19955cabf5d9be' //申请的安全密钥
}
export default {
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data(){
        return{
            isLoading: false, //刷新参数
            longitude:'',
            latitude:'',
            address:"",//详细地址
        }
    },
    created() {
        this.initMap();
        this.longitude=this.$route.query.longitude;
        this.latitude=this.$route.query.latitude;
        this.address=this.$route.query.address;
    },
    methods:{
        //刷新方法
        onRefresh() {
            setTimeout(() => {
                Toast("刷新成功");
                this.isLoading = false;
                //调用请求
            }, 1000);
        },
        initMap() {
            AMapLoader.load({
                "key": "f2e81a7c6a4003d77fecd9ea57c78da8",   // 申请好的Web端开发者Key，首次调用 load 时必填
                "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": []  //插件列表
            }).then((AMap) => {
                let map = new AMap.Map('map', {
                    center: [this.longitude, this.latitude],
                    zoom: 13
                });
                let trafficLayer = new AMap.TileLayer.Traffic({
                    zIndex: 2
                });
                var geocoder;
                AMap.plugin(("AMap.Geocoder"), function () {
                    geocoder = new AMap.Geocoder({
                        city: '全国', // 如果你想获得更精准的城市信息，可以指定特定城市，例如 '北京市'
                        // radius: 1000,// 查询半径，单位：米
                        extensions: "all"
                    });
                });
                // 创建一个标记并添加到地图
                var marker = new AMap.Marker({
                    position: [this.longitude, this.latitude], // 标记的坐标
                    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png', // 自定义图标的 URL
                    map: map
                });
                let infoWindow = new AMap.InfoWindow({
                    content: this.address, // 替换为实际的地址信息
                    position: [this.longitude, this.latitude] // 替换为实际的经纬度坐标
                });
                // 在地图上打开信息窗体
                infoWindow.open(map, [this.longitude, this.latitude]);

                map.add(marker);
                map.add(geocoder);
                map.add(trafficLayer);
            }).catch(e => {
                console.log(e);
            })
        }
    }
}
</script>