import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/mainPage/Home.vue')
  },
  // 登陆页面
  {
    path: '/login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/pass',
    component: () => import('../views/Pass.vue')
  },
  {
    path: '/threeLogin',
    component: () => import('../views/threeLogin.vue')
  },
  // 登陆页面-结算
  {
    path: '/SelectARecord',
    component: () => import('../views/mainPage/SelectARecord.vue')
  },
  // 主页面
  {
    path: '/home',
    component: () => import('../views/mainPage/Home.vue')
  },
  {
    path: '/BindCar',
    component: () => import('../views/mainPage/bindCar/BindCar.vue')
  },
  {
    path: '/carWashCalendar',
    component: () => import('../views/mainPage/CarWashCalendar.vue')
  },
  // 附近门店
  {
    path: '/nearByStore',
    component: () => import('../views/nearShop/NearByStore.vue')
  },
  {
    path: '/StoreInformation',
    component: () => import('../views/nearShop/storeDetail/StoreInformation.vue')
  },
  {
    path: '/StationDetail',
    component: () => import('../views/nearShop/storeDetail/StationDetail.vue')
  },
  {
    path: '/EvaluateDetail',
    component: () => import('../views/nearShop/storeDetail/EvaluateDetail.vue')
  },
  {
    path: '/StoreMap',
    component: () => import('../views/nearShop/storeDetail/StoreMap.vue')
  },
  {
    path: '/BindCarOfStore',
    component: () => import('../views/nearShop/storeDetail/BindCarOfStore.vue')
  },
  // 商城
  {
    path: '/store',
    component: () => import('../views/store/Store.vue')
  },
  // 商品评价
  {
    path: '/Evaluate',
    component: () => import('../views/store/Evaluate.vue')
  },
  // 店铺详情
  {
    path: '/StoreCheck',
    component: () => import('../views/store/StoreCheck.vue')
  },
  // 兑换订单
  {
    path: '/SingleOrder',
    component: () => import('../views/store/SingleOrder.vue')
  },
  // 我的
  {
    path: '/my',
    component: () => import('../views/my/My.vue')
  },
  {
    path: '/payment',
    component: () => import('../views/my/common/Payment.vue')
  },
  {
    path: '/map',
    component: () => import('../views/map/Map.vue')
  },
  {
    path: '/SingleCommodity',
    component: () => import('../views/store/SingleCommodity.vue')
  },


]

const router = new VueRouter({
  routes
})

export default router
