import { defineStore } from 'pinia'

// 订单模块 (F-04, F-05, F-08, F-09)
// 状态：待付款 / 待发货 / 已发货 / 已完成 / 已取消
let seq = 1
function genOrderId() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  return `OD${date}${String(seq++).padStart(4, '0')}`
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: JSON.parse(localStorage.getItem('tb_orders') || '[]')
  }),
  getters: {
    byStatus: (s) => (status) => (status === 'all' ? s.orders : s.orders.filter((o) => o.status === status))
  },
  actions: {
    persist() {
      localStorage.setItem('tb_orders', JSON.stringify(this.orders))
    },
    create({ items, address, payMethod }) {
      const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      const order = {
        orderId: genOrderId(),
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          quantity: i.quantity
        })),
        address,
        payMethod,
        totalAmount,
        status: '待付款',
        createTime: new Date().toLocaleString('zh-CN'),
        logistics: null
      }
      this.orders.unshift(order)
      this.persist()
      return order
    },
    pay(orderId) {
      const o = this.orders.find((o) => o.orderId === orderId)
      if (o && o.status === '待付款') {
        o.status = '待发货'
        this.persist()
      }
    },
    // 模拟商家发货 (F-08)
    ship(orderId) {
      const o = this.orders.find((o) => o.orderId === orderId)
      if (o && o.status === '待发货') {
        o.status = '已发货'
        o.logistics = {
          company: '顺丰速运',
          trackingNumber: 'SF' + Math.floor(1e11 + Math.random() * 8e11),
          shipTime: new Date().toLocaleString('zh-CN')
        }
        this.persist()
      }
    },
    confirm(orderId) {
      const o = this.orders.find((o) => o.orderId === orderId)
      if (o && o.status === '已发货') {
        o.status = '已完成'
        this.persist()
      }
    },
    cancel(orderId) {
      const o = this.orders.find((o) => o.orderId === orderId)
      if (o && ['待付款', '待发货'].includes(o.status)) {
        o.status = '已取消'
        this.persist()
      }
    }
  }
})
