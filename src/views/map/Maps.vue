

<template>
  <div class="Map" style="background-color: white;margin-bottom: 20px">
    <div id="container"></div>
    <div style="margin-right: 5px;color: white;border-radius: 3px;height: 20px;width: 100%;padding-bottom: 5px;background-color: rgba(0,0,0,0.5)">
      &nbsp 距离:{{getToDistance}}米 &nbsp 耗时:{{getToTime1}}时{{getToTime2}}分
    </div>
  </div>
</template>
<script>
export default {
  props:{
    xy:[]
  },
  data() {
    return {
      getToDistance:0,
      getToTime1:0,
      getToTime2:1,
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
      address:[],
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
          sessionStorage.setItem("place", r.point.lng+","+r.point.lat);
        } else {
          console.log('获取失败');
        }
      });
      this.center.lng = _this.center.lng
      this.center.lat = _this.center.lat
      this.atTimeOut()
    },
    atTimeOut(){
      // 1s 后执行的代码
      const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
      }
      sleep(1000).then(() => {
        console.log("子类触发循环:::")
        if(this.center.lng===0){
          this.atTimeOut()
        }else {
          this.goFather(this.center.lng+","+this.center.lat)
        }
        // 这里写你的操作
      })
    },
    goFather(t) {
      console.log("子类触发发送给父类方法:::")
      console.log(t)
      t=="0,0"?"113.9808583,34.96225983":t
      // t=="113.9808583,34.96225983"
      this.$emit("goFathers", t);
    },
  },
  mounted() {
    //初始化地图
    // this.goFather(t)
    this.initMap();

    if(sessionStorage.getItem("place")!=null){
      this.xyaddress = sessionStorage.getItem("place").split(",")
      this.goFather(this.xyaddress[0]+","+this.xyaddress[1])
    }else {
      this.fixedPosition();
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
  height: 100%;

}

#container {
  width: 100%;
  height: 200px;
}
</style>