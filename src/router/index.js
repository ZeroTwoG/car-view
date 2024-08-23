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
  // 附近门店
  {
    path: '/nearByStore',
    component: () => import('../views/nearShop/NearByStore.vue')
  },
  // 商城
  {
    path: '/store',
    component: () => import('../views/store/Store.vue')
  },
  // 我的
  {
    path: '/my',
    component: () => import('../views/my/My.vue')
  },
  // 我的-公共
  {
    path: '/payment',
    component: () => import('../views/my/common/Payment.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
