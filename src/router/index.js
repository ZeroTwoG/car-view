import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/index.vue')
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
  // 主页面
  {
    path: '/index',
    component: () => import('../views/index.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
