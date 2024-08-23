

<template>
  <div class="Map" style="background-color: white;margin-bottom: 20px">
    <div id="container"></div>
    <div style="padding-bottom: 10px;width: 100%">
      <div style="width: 100%;height:100%;;top: 10px;margin: auto">
        <div style="margin: 10px;">
          <div><el-input v-model="address" placeholder="当前地址" class="handle-input mr10" :disabled="true" style="width:100%;float: left"></el-input></div>
          <el-button type="primary" class="mr10" @click="navigation" style="margin-top: 10px">导航至目标位置</el-button>
          <el-button type="primary" class="mr10" @click="fixedPosition" style="margin-left: 10px">定位</el-button>
        </div>
      </div>
    </div>
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
        lng: '',
        lat: '',
        address: '',

      },
      map: null,
      //搜索参数
      searchLocationValue: '',
      address:'',
      xyaddress: '',
      local: null
    }
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

      const _this = this;
      const ther = {
        xy:''
      };
      //添加地图点击事件
      this.map.addEventListener('click', function(e) {

        console.log('点击位置经纬度：' + e.point.lng + ',' + e.point.lat);
        _this.center.lng = e.point.lng;
        _this.center.lat = e.point.lat;


        //清除之前的标记
        _this.map.clearOverlays();
        // 创建点标记
        var point = new BMap.Point(_this.center.lng, _this.center.lat);
        //获取位置信息
        var geocoder = new BMap.Geocoder();
        geocoder.getLocation(point, function(geocoderResult, LocationOptions) {
          //清除之前的标记
          _this.map.clearOverlays()
          _this.map.addControl(new BMap.NavigationControl());
          var marker = new BMap.Marker(point);
          // 创建标注
          _this.map.addOverlay(marker);
          //地址定位成功
          var address = geocoderResult.address;
          console.log("所处地址", address)
          var add = geocoderResult.content.address_detail;
          var adds = geocoderResult.content
          console.log(adds)
          _this.address =add.province+add.city+add.district+add.street+add.street_number+adds.poi_desc;
          console.log(_this.address)
          _this.xyaddress=_this.center.lng+","+_this.center.lat
        });

      });
      this.address= _this.address
      this.xyaddress=_this.xyaddress
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
          _this.model.lng = r.point.lng;
          _this.model.lat = r.point.lat;
          _this.address =(r.address.country+","+ r.address.province+","+r.address.city+","+r.address.district+","+r.address.street).toString();
          _this.xyaddress=(r.point.lng+","+r.point.lat).toString();
              console.log(_this.address)
          console.log("当前位置经纬度:", r.point.lng,r.point.lat);
        } else {
          console.log('获取失败');
        }
      });
      this.address= _this.address
      this.xyaddress=_this.xyaddress
    },
    /**
     * 地图搜索
     */
    searchLocation() {

      this.local = new BMap.LocalSearch(this.map, {
        renderOptions: {
          map: this.map
        },
        onSearchComplete: this.searchCallback //设置回调函数

      });
      this.local.search(this.searchLocationValue); //设置搜索参数

    },
    /**
     * 搜索结果的回调函数
     */
    searchCallback() {
      var point = this.local.getResults().getPoi(0).point;
      //获取第一个智能搜索的结果
      console.log("当前位置的经纬度",point.lng, point.lat);
      point.city=this.local.getResults().getPoi(0).city;
      console.log("当前位置的城市",point.city)
    },
    /**
     * 导航
     */
    navigation(){
      if(this.center.lng==0||this.center.lat==0){
        alert("请先获取您的位置")
        return
      }
      //出发地
      var p1 = new BMap.Point(this.center.lng, this.center.lat);
      //目的地
      var p2 = new BMap.Point(this.model.lng, this.model.lat);

      var driving = new BMap.DrivingRoute(this.map, {
        renderOptions: {
          map: this.map,
          autoViewport: true
        }
      });
      var map = new BMap.Map('')
      driving.search(p2, p1);
      // console.log(('距离：' + (map.getDistance(p2, p1)).toFixed(2) + '米'))
      // console.log("导航")
      // console.log(driving)

    }

  },


  mounted() {
    //初始化地图
    this.initMap();
    this.fixedPosition();
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
  height: 100%;

}

#container {
  width: 100%;
  height: 700px;
}
</style>