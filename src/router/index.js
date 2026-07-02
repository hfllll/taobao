import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/search', name: 'search', component: () => import('@/views/Search.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetail.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/Cart.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/Checkout.vue'), meta: { auth: true } },
  { path: '/orders', name: 'orders', component: () => import('@/views/Orders.vue'), meta: { auth: true } },
  { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 登录守卫（纯前端 Mock）
router.beforeEach((to) => {
  if (to.meta.auth) {
    const token = localStorage.getItem('tb_token')
    if (!token) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
  return true
})

export default router
