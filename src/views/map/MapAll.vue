

<template>
  <div class="Map" style="background-color: white;margin-bottom: 20px">
    <el-button type="primary" icon="el-icon-map-location" @click="fixedPosition" style="width: 100%">定位并导航</el-button>

    <div id="container"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      center: {
        lng: 0,
        lat: 0
      },
      zoom: 10,
      model: {
        lng: 0,
        lat: 0,
      },
      map: null,
      searchLocationValue: '',
      address:'',
      xyaddress: '',
      local: null,
      storeAddress: '',
    }
  },
  mounted() {
    this.model.lng = this.$route.query.xs;
    this.model.lat = this.$route.query.ys;

            //初始化地图
    this.initMap();
    this.fixedPosition();
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      // 创建Map实例 注意要和上面写的div的id名一样
      this.map = new BMap.Map("container");

      // 初始化地图,设置初始化位置，及地图级别
      var initPoint=new BMap.Point(113.61863936294826,34.75981064458093);
      this.map.centerAndZoom(initPoint, 12);
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true);

      // 创建标注
      this.map.addOverlay(new BMap.Marker(initPoint));

      // const _this = this;
      // const ther = {
      //   xy:''
      // };
      // //添加地图点击事件
      // this.map.addEventListener('click', function(e) {
      //
      //   console.log('点击位置经纬度：' + e.point.lng + ',' + e.point.lat);
      //   _this.center.lng = e.point.lng;
      //   _this.center.lat = e.point.lat;
      //
      //
      //   //清除之前的标记
      //   _this.map.clearOverlays();
      //   // 创建点标记
      //   var point = new BMap.Point(_this.center.lng, _this.center.lat);
      //   //获取位置信息
      //   var geocoder = new BMap.Geocoder();
      //   geocoder.getLocation(point, function(geocoderResult, LocationOptions) {
      //     //清除之前的标记
      //     _this.map.clearOverlays()
      //     _this.map.addControl(new BMap.NavigationControl());
      //     var marker = new BMap.Marker(point);
      //     // 创建标注
      //     _this.map.addOverlay(marker);
      //     //地址定位成功
      //     var address = geocoderResult.address;
      //     console.log("所处地址", address)
      //     var add = geocoderResult.content.address_detail;
      //     var adds = geocoderResult.content
      //     console.log(adds)
      //     _this.address =add.country+","+add.province+","+add.city+","+add.district+","+add.street+add.street_number+ ","+adds.poi_desc;
      //     console.log(_this.address)
      //     _this.xyaddress=_this.center.lng+","+_this.center.lat
      //   });

      // });
      // this.address= _this.address
      // this.xyaddress=_this.xyaddress
    },
    /**
     * 获取自己的位置
     */

    fixedPosition() {
      const _this = this;
      var geolocation = new BMap.Geolocation();
      var ass = ''
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point);
          _this.map.addOverlay(mk);
          _this.map.panTo(r.point);
          _this.center.lng = r.point.lng;
          _this.center.lat = r.point.lat;
              console.log(_this.address)
          console.log("当前位置经纬度:", r.point.lng,r.point.lat);
        } else {
          console.log('获取失败');
          var xy = sessionStorage.getItem("place").split(",")
          this.center.lng = xy[0]
          this.center.lat = xy[1]
        }
      });
      this.map.clearOverlays();

      this.atTimeOut();
    },
    atTimeOut(){
      // 1s 后执行的代码
      const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
      }
      sleep(1000).then(() => {
        console.log("触发循环:::")
        if(this.center.lng===0){
          this.atTimeOut()
        }else {
          this.navigation()
        }
        // 这里写你的操作
      })
    },
    /**
     * 导航
     */
    navigation(){
      console.log("进入导航")
        //出发地
        var p1 = new BMap.Point(this.model.lng,this.model.lat);
        //目的地
        var p2 = new BMap.Point(this.center.lng,this.center.lat)

        var driving = new BMap.DrivingRoute(this.map, {
          renderOptions: {
            map: this.map,
            autoViewport: true
          }
        });
        var map = new BMap.Map('')
        driving.search(p2, p1);

    }

  },





}
</script>

<style>
.el-main{
  line-height: 30px;
}
#l-map {
  height: 200px;
  width: 500px;
}

#r-result {
  width: 100%;
}

.Map {
  width: 100%;
  height: 100px;

}

#container {
  width: 100%;
  height: 900px;
}
</style>