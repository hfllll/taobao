import { defineStore } from 'pinia'
import { defaultAddresses } from '@/data/mock'

// 用户模块 (F-11) + 浏览/购买行为记录（供推荐模块使用 F-10）
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('tb_token') || '',
    profile: JSON.parse(localStorage.getItem('tb_user') || 'null'),
    addresses: [...defaultAddresses],
    // 行为记录：浏览过的商品分类计数、浏览过的商品id、已购买商品id
    viewedCategories: JSON.parse(localStorage.getItem('tb_view_cat') || '{}'),
    viewedProducts: JSON.parse(localStorage.getItem('tb_view_pid') || '[]'),
    purchasedProducts: JSON.parse(localStorage.getItem('tb_buy_pid') || '[]')
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    defaultAddress: (s) => s.addresses.find((a) => a.isDefault) || s.addresses[0]
  },
  actions: {
    login(username) {
      // 纯前端 Mock 登录：任意账号密码即可
      this.token = 'mock-token-' + Date.now()
      this.profile = {
        userId: 1001,
        username,
        nickname: username || '淘宝用户',
        role: 'consumer',
        avatar: ''
      }
      localStorage.setItem('tb_token', this.token)
      localStorage.setItem('tb_user', JSON.stringify(this.profile))
    },
    logout() {
      this.token = ''
      this.profile = null
      localStorage.removeItem('tb_token')
      localStorage.removeItem('tb_user')
    },
    // 记录浏览行为
    trackView(product) {
      if (!product) return
      this.viewedCategories[product.categoryId] = (this.viewedCategories[product.categoryId] || 0) + 1
      this.viewedProducts = [product.id, ...this.viewedProducts.filter((id) => id !== product.id)].slice(0, 30)
      localStorage.setItem('tb_view_cat', JSON.stringify(this.viewedCategories))
      localStorage.setItem('tb_view_pid', JSON.stringify(this.viewedProducts))
    },
    // 记录购买行为
    trackPurchase(productIds) {
      this.purchasedProducts = Array.from(new Set([...productIds, ...this.purchasedProducts])).slice(0, 50)
      localStorage.setItem('tb_buy_pid', JSON.stringify(this.purchasedProducts))
    },
    addAddress(addr) {
      const id = 200 + this.addresses.length + 1
      if (addr.isDefault) this.addresses.forEach((a) => (a.isDefault = false))
      this.addresses.push({ ...addr, id })
    }
  }
})
