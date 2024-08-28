

<template>
  <div class="Map" style="background-color: white;margin-bottom: 20px">
    <div id="container"></div>
    <div style="margin-right: 5px;color: white;border-radius: 3px;height: 20px;width: 100%;padding-bottom: 5px;background-color: rgba(0,0,0,0.5)">
      &nbsp 距离:{{getToDistance}} &nbsp 耗时:{{getToTime1}}
    </div>
  </div>
</template>
<script>
export default {
  props:{
    xy:""
  },
  data() {
    return {
      getToDistance:0,
      getToTime1:0,
      center: {
        lng: 0,
        lat: 0
      },
      map: null,
      //搜索参数
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

      // 创建标注
      this.map.addOverlay(new BMap.Marker(initPoint));

      const _this = this;
    },

    sleeps(times){
      // 后执行的代码
      const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
      }

      sleep(times).then(() => {
        this.navigation();
      })
    },
    /**
     * 导航
     */
    navigation(){
      if(this.xy.size>0){
        console.log("未接收到父类参数::")
        console.log(this.xy.size)
        this.sleeps(2000);
        return;
      }
      console.log("接收父类参数::")
      console.log(this.xy)
      var list = this.xy.split(",")
      //出发地
      var p2 = new BMap.Point(list[0],list[1]);
      //目的地
      var p1 = new BMap.Point(list[2],list[3])

      var driving = new BMap.DrivingRoute(this.map, {
        renderOptions: {
          map: this.map,
          autoViewport: true
        }
      });
      var map = new BMap.Map('')
      driving.search(p2, p1);
      this.getToDistance = (map.getDistance(p2, p1)).toFixed(2)
      let  getToTime= parseInt(this.getToDistance*60/1000/40)
      var times = parseInt(getToTime/60)>0?parseInt(getToTime/60)+"时":0
      var timess = parseInt(getToTime%60)!=0?times!=0?parseInt(getToTime%60)+"分":parseInt(getToTime%60)+"分钟":"1分钟"
      this.getToTime1 = (times!=0?times:"")+timess
      this.getToDistance = this.getToDistance>1000?(this.getToDistance/1000).toFixed(2)+"公里":parseInt(this.getToDistance)+"米"
      console.log(driving)
    }


  },


  mounted() {
    //初始化地图
    this.initMap();
    this.navigation();
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