import { defineStore } from 'pinia'

// 购物车模块 (F-03)
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('tb_cart') || '[]')
    // item: { product, quantity, selected }
  }),
  getters: {
    count: (s) => s.items.reduce((n, i) => n + i.quantity, 0),
    selectedItems: (s) => s.items.filter((i) => i.selected),
    selectedCount() {
      return this.selectedItems.reduce((n, i) => n + i.quantity, 0)
    },
    totalAmount() {
      return this.selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    },
    allSelected: (s) => s.items.length > 0 && s.items.every((i) => i.selected)
  },
  actions: {
    persist() {
      localStorage.setItem('tb_cart', JSON.stringify(this.items))
    },
    add(product, quantity = 1) {
      const exist = this.items.find((i) => i.product.id === product.id)
      if (exist) {
        exist.quantity = Math.min(exist.quantity + quantity, product.stock)
      } else {
        this.items.push({ product, quantity: Math.min(quantity, product.stock), selected: true })
      }
      this.persist()
    },
    updateQty(productId, quantity) {
      const it = this.items.find((i) => i.product.id === productId)
      if (it) {
        it.quantity = Math.max(1, Math.min(quantity, it.product.stock))
        this.persist()
      }
    },
    remove(productId) {
      this.items = this.items.filter((i) => i.product.id !== productId)
      this.persist()
    },
    toggle(productId) {
      const it = this.items.find((i) => i.product.id === productId)
      if (it) {
        it.selected = !it.selected
        this.persist()
      }
    },
    toggleAll(val) {
      this.items.forEach((i) => (i.selected = val))
      this.persist()
    },
    clearSelected() {
      this.items = this.items.filter((i) => !i.selected)
      this.persist()
    }
  }
})
