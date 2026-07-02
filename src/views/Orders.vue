<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/store/order'
import { toast } from '@/utils/toast'

const router = useRouter()
const orderStore = useOrderStore()

const tabs = ['all', '待付款', '待发货', '已发货', '已完成', '已取消']
const tabLabels = { all: '全部', 待付款: '待付款', 待发货: '待发货', 已发货: '待收货', 已完成: '已完成', 已取消: '已取消' }
const active = ref('all')

const list = computed(() => orderStore.byStatus(active.value))

const statusColor = {
  待付款: 'text-tb-red',
  待发货: 'text-tb-orange',
  已发货: 'text-blue-500',
  已完成: 'text-green-500',
  已取消: 'text-gray-400'
}

function pay(o) {
  orderStore.pay(o.orderId)
  toast('支付成功')
}
function ship(o) {
  orderStore.ship(o.orderId)
  toast('商家已发货（模拟）')
}
function confirm(o) {
  orderStore.confirm(o.orderId)
  toast('已确认收货')
}
function cancel(o) {
  orderStore.cancel(o.orderId)
  toast('订单已取消', 'info')
}
</script>

<template>
  <div class="container-main py-4">
    <h1 class="text-lg font-bold mb-3">📋 我的订单</h1>

    <!-- 状态标签 -->
    <div class="bg-white rounded-t-lg shadow-card flex border-b">
      <div
        v-for="t in tabs"
        :key="t"
        class="px-6 py-3 text-sm cursor-pointer border-b-2 -mb-px transition"
        :class="active === t ? 'border-tb-orange text-tb-orange font-medium' : 'border-transparent text-gray-500'"
        @click="active = t"
      >
        {{ tabLabels[t] }}
      </div>
    </div>

    <div v-if="list.length" class="space-y-3 mt-3">
      <div v-for="o in list" :key="o.orderId" class="bg-white rounded-lg shadow-card overflow-hidden">
        <div class="flex items-center justify-between px-5 py-2.5 bg-gray-50 text-xs text-gray-500">
          <div class="flex gap-4">
            <span>订单号：{{ o.orderId }}</span>
            <span>{{ o.createTime }}</span>
          </div>
          <span class="font-medium" :class="statusColor[o.status]">{{ o.status }}</span>
        </div>

        <div class="p-5">
          <div class="flex">
            <div class="flex-1 space-y-3">
              <div v-for="it in o.items" :key="it.productId" class="flex items-center gap-3">
                <img :src="it.image" class="w-14 h-14 rounded object-cover cursor-pointer" @click="router.push({ name: 'product', params: { id: it.productId } })" />
                <span class="flex-1 text-sm line-clamp-1">{{ it.productName }}</span>
                <span class="text-sm text-gray-500">¥{{ it.price }} × {{ it.quantity }}</span>
              </div>
            </div>

            <div class="w-48 border-l pl-5 flex flex-col items-end justify-center gap-2">
              <div class="text-sm text-gray-500">实付：<span class="price text-lg">¥{{ o.totalAmount.toFixed(2) }}</span></div>
              <div class="flex flex-col gap-2 w-28">
                <button v-if="o.status === '待付款'" class="btn-primary text-xs py-1.5" @click="pay(o)">立即付款</button>
                <button v-if="o.status === '待付款'" class="text-xs text-gray-400 hover:text-tb-red" @click="cancel(o)">取消订单</button>
                <button v-if="o.status === '待发货'" class="btn-outline text-xs py-1.5" @click="ship(o)">模拟发货</button>
                <button v-if="o.status === '已发货'" class="btn-primary text-xs py-1.5" @click="confirm(o)">确认收货</button>
                <router-link v-if="o.status === '已完成'" :to="{ name: 'product', params: { id: o.items[0].productId } }" class="text-xs text-tb-orange text-center border border-tb-orange rounded py-1.5">评价晒单</router-link>
              </div>
            </div>
          </div>

          <div v-if="o.logistics" class="mt-3 pt-3 border-t text-xs text-gray-400">
            🚚 {{ o.logistics.company }} · 运单号 {{ o.logistics.trackingNumber }} · 发货时间 {{ o.logistics.shipTime }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-b-lg shadow-card py-24 text-center text-gray-400">
      <div class="text-5xl mb-3">📭</div>
      暂无相关订单
      <div class="mt-4"><button class="btn-primary" @click="router.push('/')">去购物</button></div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
