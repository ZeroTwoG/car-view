import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入vant
import Van from 'vant'
import 'vant/lib/index.css';
Vue.use(Van)

// 引入vue-amap
import VueAMap from 'vue-amap'

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = "http://172.16.7.55:7011"
Vue.prototype.$axios = axios;

// 工具类
import _ from 'lodash';
Vue.prototype._ = _;
// 深层拷贝: var data1 = _.cloneDeep(data2);

Vue.use(VueAMap)

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '8b25caa4d4b08f7cc6a6f036094f27d5',
  // 插件集合
  plugin: [
    'AMap.CircleEditor',// 圆形编辑器插件
    "AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder", // 地理编码与逆地理编码服务，用于地址描述与坐标间的相互转换
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.CitySearch",
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});
//高德的安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '5eff5dfe18a510317ace06da8652ca38',
}

//底部四个按钮固定位置
// import Foot from './components/Foot.vue'
// Vue.component('Foot', Foot)

//请求拦截器---设置携带token令牌--请求拦截器
axios.interceptors.request.use(config => {
  var token = sessionStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
})
//前置路由守卫 to: 即将要访问的路径 from: 从哪里来 next: 放行函数 前置路由守卫
router.beforeEach((to, from, next) => {
  //如果用户访问的是登录页面，直接放行
  if (to.path === "/login") {
    //放行
    return next();
  }
  //获取sessionStorage中保存的token值
  const token = window.sessionStorage.getItem("token");
  //如果token不存在，强制跳转到登录页面
  if (!token) {
    return next("/login");
  }
  //如果token存在，直接放行
  next();
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
