<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import { useOrderStore } from '@/store/order'
import { toast } from '@/utils/toast'

const router = useRouter()
const cart = useCartStore()
const user = useUserStore()
const orderStore = useOrderStore()

const items = computed(() => cart.selectedItems)
const selectedAddrId = ref(user.defaultAddress?.id)
const payMethod = ref('online')
const showAddrForm = ref(false)
const newAddr = ref({ name: '', phone: '', region: '', detail: '', isDefault: false })

const freight = computed(() => (cart.totalAmount >= 99 || cart.totalAmount === 0 ? 0 : 8))
const payTotal = computed(() => cart.totalAmount + freight.value)

function saveAddr() {
  if (!newAddr.value.name || !newAddr.value.phone || !newAddr.value.detail) {
    toast('请填写完整收货信息', 'error')
    return
  }
  user.addAddress({ ...newAddr.value })
  selectedAddrId.value = user.addresses[user.addresses.length - 1].id
  showAddrForm.value = false
  newAddr.value = { name: '', phone: '', region: '', detail: '', isDefault: false }
  toast('地址已添加')
}

function submit() {
  if (!items.value.length) {
    toast('没有可结算的商品', 'error')
    return
  }
  const address = user.addresses.find((a) => a.id === selectedAddrId.value)
  if (!address) {
    toast('请先添加收货地址', 'error')
    return
  }
  // 库存校验（模拟）
  const short = items.value.find((i) => i.quantity > i.product.stock)
  if (short) {
    toast(`${short.product.name} 库存不足，仅剩 ${short.product.stock} 件`, 'error')
    return
  }

  const order = orderStore.create({ items: items.value, address, payMethod: payMethod.value })
  // 模拟支付
  orderStore.pay(order.orderId)
  user.trackPurchase(items.value.map((i) => i.product.id))
  cart.clearSelected()
  toast('下单并支付成功！')
  router.push('/orders')
}
</script>

<template>
  <div class="container-main py-4">
    <h1 class="text-lg font-bold mb-3">📝 确认订单</h1>

    <!-- 收货地址 -->
    <div class="bg-white rounded-lg shadow-card p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-medium">📍 收货地址</h2>
        <button class="text-xs text-tb-orange" @click="showAddrForm = !showAddrForm">{{ showAddrForm ? '取消' : '+ 新增地址' }}</button>
      </div>

      <div class="flex flex-wrap gap-3">
        <div
          v-for="a in user.addresses"
          :key="a.id"
          class="w-72 border-2 rounded-lg p-3 cursor-pointer transition"
          :class="selectedAddrId === a.id ? 'border-tb-orange bg-orange-50' : 'border-gray-200 hover:border-orange-300'"
          @click="selectedAddrId = a.id"
        >
          <div class="flex items-center gap-2">
            <span class="font-medium text-sm">{{ a.name }}</span>
            <span class="text-gray-500 text-sm">{{ a.phone }}</span>
            <span v-if="a.isDefault" class="text-[10px] bg-tb-orange text-white px-1 rounded">默认</span>
          </div>
          <p class="text-xs text-gray-500 mt-1.5 leading-5">{{ a.region }} {{ a.detail }}</p>
        </div>
      </div>

      <!-- 新增地址表单 -->
      <div v-if="showAddrForm" class="mt-4 grid grid-cols-2 gap-3 max-w-2xl border-t pt-4">
        <input v-model="newAddr.name" placeholder="收货人姓名" class="border rounded px-3 py-2 text-sm outline-none focus:border-tb-orange" />
        <input v-model="newAddr.phone" placeholder="手机号码" class="border rounded px-3 py-2 text-sm outline-none focus:border-tb-orange" />
        <input v-model="newAddr.region" placeholder="省 / 市 / 区" class="border rounded px-3 py-2 text-sm outline-none focus:border-tb-orange" />
        <input v-model="newAddr.detail" placeholder="详细地址（街道、门牌号）" class="border rounded px-3 py-2 text-sm outline-none focus:border-tb-orange" />
        <label class="flex items-center gap-2 text-xs text-gray-500">
          <input v-model="newAddr.isDefault" type="checkbox" class="accent-tb-orange" /> 设为默认地址
        </label>
        <div><button class="btn-primary text-sm py-1.5" @click="saveAddr">保存地址</button></div>
      </div>
    </div>

    <!-- 商品清单 -->
    <div class="bg-white rounded-lg shadow-card p-5 mt-3">
      <h2 class="font-medium mb-3">🛍️ 商品清单</h2>
      <div v-for="item in items" :key="item.product.id" class="flex items-center py-3 border-b last:border-0">
        <img :src="item.product.images[0]" class="w-14 h-14 rounded object-cover" />
        <span class="flex-1 text-sm px-4 line-clamp-1">{{ item.product.name }}</span>
        <span class="w-24 text-center price">¥{{ item.product.price }}</span>
        <span class="w-20 text-center text-gray-500 text-sm">x{{ item.quantity }}</span>
        <span class="w-28 text-right price font-bold">¥{{ (item.product.price * item.quantity).toFixed(2) }}</span>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="bg-white rounded-lg shadow-card p-5 mt-3">
      <h2 class="font-medium mb-3">💳 支付方式</h2>
      <div class="flex gap-3">
        <div
          v-for="m in [['online', '💰 在线支付'], ['cod', '🚚 货到付款']]"
          :key="m[0]"
          class="border-2 rounded-lg px-6 py-2.5 text-sm cursor-pointer transition"
          :class="payMethod === m[0] ? 'border-tb-orange bg-orange-50 text-tb-orange' : 'border-gray-200'"
          @click="payMethod = m[0]"
        >
          {{ m[1] }}
        </div>
      </div>
    </div>

    <!-- 结算栏 -->
    <div class="bg-white rounded-lg shadow-card p-5 mt-3 flex items-center justify-end gap-8">
      <div class="text-sm text-gray-500 space-y-1 text-right">
        <div>商品金额：<span class="text-gray-700">¥{{ cart.totalAmount.toFixed(2) }}</span></div>
        <div>运费：<span class="text-gray-700">{{ freight === 0 ? '包邮' : '¥' + freight.toFixed(2) }}</span></div>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-500">应付总额</div>
        <div class="price text-3xl">¥{{ payTotal.toFixed(2) }}</div>
      </div>
      <button class="btn-primary text-lg px-12 py-3 rounded-full" @click="submit">提交订单</button>
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
