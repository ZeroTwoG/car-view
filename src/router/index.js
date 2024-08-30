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
    path: '/Selectastore',
    component: () => import('../views/mainPage/bindCar/Selectastore.vue')
  },
  {
    path: '/carWashCalendar',
    component: () => import('../views/mainPage/CarWashCalendar.vue')
  },
  {
    path: '/SettlementIsOpen',
    component: () => import('../views/mainPage/SettlementIsOpen.vue')
  },
  {
    path: '/CarWashTicket',
    component: () => import('../views/mainPage/CarWashTicket.vue')
  },
  {
    path: '/StoreComment',
    component: () => import('../views/mainPage/StoreComment.vue')
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
  {
    path: '/detailBalance',
    component: () => import('../views/my/common/DetailBalance.vue')
  },
  // 商城
  {
    path: '/store',
    component: () => import('../views/store/Store.vue')
  },
  {
    path: '/AddressManagementStore',
    component: () => import('../views/store/AddressManagementStore.vue')
  },
  {
    path: '/addressManagement',
    component: () => import('../views/store/AddressManagement.vue')
  },
  {
    path: '/addressEdit',
    component: () => import('../views/store/AddressEdit.vue')
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
    path: '/SingleCommodity',
    component: () => import('../views/store/SingleCommodity.vue')
  },
  {
    path: '/myCar',
    component: () => import('../views/my/common/MyCar.vue')
  },
  {
    path: '/balance',
    component: () => import('../views/my/common/Balance.vue')
  },
  {
    path: '/payChooseStore',
    component: () => import('../views/my/common/PayChooseStore.vue')
  },
  {
    path: '/carBindStore',
    component: () => import('../views/my/common/CarBindStore.vue')
  },
  {
    path: '/unpaid',
    component: () => import('@/views/store/oreder/Unpaid.vue')
  },
  {
    path: '/orderDetailed',
    component: () => import('@/views/store/oreder/OrderDetailed.vue')
  },
  {
    path: '/orderComment',
    component: () => import('../views/store/oreder/OrderComment.vue')
  },
  {
    path: '/aboutUs',
    component: () => import('../views/my/amateurish/AboutUs.vue')
  },
  {
    path: '/instructions',
    component: () => import('../views/my/amateurish/Instructions.vue')
  },
  {
    path: '/serviceAgreement',
    component: () => import('../views/my/amateurish/ServiceAgreement.vue')
  },
  {
    path: '/systemSetting',
    component: () => import('../views/my/amateurish/SystemSetting.vue')
  },
  {
    path: '/washCarCourse',
    component: () => import('../views/my/amateurish/WashCarCourse.vue')
  },
  {
    path: '/personInfo',
    component: () => import('../views/my/PersonInfo.vue')
  },
  {
    path: '/StoreBind',
    component: () => import('../views/my/common/StoreBind.vue')
  },
  {
    path: '/StoreDetail',
    component: () => import('../views/my/common/StoreDetail.vue')
  },
  {
    path: '/integral',
    component: () => import('../views/my/common/Integral.vue')
  },
  {
    path: '/detailIntegral',
    component: () => import('../views/my/common/DetailIntegral.vue')
  },
  {
    path: '/pay',
    component: () => import('../views/my/common/WechatPay.vue')
  },
  {
    path: '/PayFinish',
    component: () => import('../views/my/PayFinish.vue')
  },
  //消息
  {
    path: '/msgHome',
    component: () => import('../views/msg/MsgHome.vue')
  },
  {
    path: '/chatAiMsg',
    component: () => import('../views/msg/ChatAiMsg.vue')
  },
  {
    path: '/StoreMsg',
    component: () => import('../views/msg/StoreMsg.vue')
  },
  {
    path: '/TextMsg',
    component: () => import('../views/msg/TextMsg.vue')
  },





  //音乐组件
  {
    path: '/music',
    component: () => import('../views/music/Music.vue')
  },
  {
    path: '/kmusic',
    component: () => import('../views/music/KMusic.vue')
  },
  {
    path: '/moremsg',
    component: () => import('../views/music/MoreMsg.vue')
  },
  // 地图
  {
    path: '/mapAll',
    component: () => import('../views/map/MapAll.vue')
  },
  // 导航
  {
    path: '/map',
    component: () => import('../views/map/Map.vue')
  },
  // 定位
  {
    path: '/maps',
    component: () => import('../views/map/Maps.vue')
  },


]

const router = new VueRouter({
  routes
})

export default router
