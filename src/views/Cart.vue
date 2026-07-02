<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'

const router = useRouter()
const cart = useCartStore()
const user = useUserStore()

function checkout() {
  if (!cart.selectedItems.length) {
    toast('请先选择要结算的商品', 'error')
    return
  }
  if (!user.isLoggedIn) {
    toast('请先登录', 'error')
    router.push({ name: 'login', query: { redirect: '/checkout' } })
    return
  }
  router.push('/checkout')
}
</script>

<template>
  <div class="container-main py-4">
    <h1 class="text-lg font-bold mb-3">🛒 我的购物车</h1>

    <div v-if="cart.items.length" class="bg-white rounded-lg shadow-card">
      <!-- 表头 -->
      <div class="flex items-center px-5 py-3 text-xs text-gray-400 border-b">
        <label class="flex items-center gap-2 w-52 cursor-pointer">
          <input type="checkbox" :checked="cart.allSelected" class="accent-tb-orange w-4 h-4" @change="cart.toggleAll($event.target.checked)" />
          全选
        </label>
        <span class="flex-1">商品信息</span>
        <span class="w-28 text-center">单价</span>
        <span class="w-32 text-center">数量</span>
        <span class="w-28 text-center">小计</span>
        <span class="w-20 text-center">操作</span>
      </div>

      <!-- 商品行 -->
      <div v-for="item in cart.items" :key="item.product.id" class="flex items-center px-5 py-4 border-b last:border-0 hover:bg-orange-50/30">
        <div class="w-52 flex items-center gap-3">
          <input type="checkbox" :checked="item.selected" class="accent-tb-orange w-4 h-4" @change="cart.toggle(item.product.id)" />
          <img :src="item.product.images[0]" class="w-16 h-16 rounded object-cover cursor-pointer" @click="router.push({ name: 'product', params: { id: item.product.id } })" />
        </div>
        <div class="flex-1 pr-4">
          <p class="text-sm line-clamp-2 hover:text-tb-orange cursor-pointer" @click="router.push({ name: 'product', params: { id: item.product.id } })">
            {{ item.product.name }}
          </p>
          <div class="flex gap-1 mt-1">
            <span v-for="t in item.product.tags" :key="t" class="text-[10px] text-tb-orange border border-orange-200 rounded px-1">{{ t }}</span>
          </div>
        </div>
        <span class="w-28 text-center price">¥{{ item.product.price }}</span>
        <div class="w-32 flex justify-center">
          <div class="flex border rounded">
            <button class="w-7 h-8 text-gray-500 hover:text-tb-orange" @click="cart.updateQty(item.product.id, item.quantity - 1)">−</button>
            <input :value="item.quantity" class="w-10 text-center border-x outline-none text-sm" @change="cart.updateQty(item.product.id, Number($event.target.value))" />
            <button class="w-7 h-8 text-gray-500 hover:text-tb-orange" @click="cart.updateQty(item.product.id, item.quantity + 1)">＋</button>
          </div>
        </div>
        <span class="w-28 text-center price font-bold">¥{{ (item.product.price * item.quantity).toFixed(2) }}</span>
        <div class="w-20 text-center">
          <button class="text-xs text-gray-400 hover:text-tb-red" @click="cart.remove(item.product.id)">删除</button>
        </div>
      </div>

      <!-- 结算栏 -->
      <div class="sticky bottom-0 flex items-center px-5 py-4 bg-white border-t rounded-b-lg shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" :checked="cart.allSelected" class="accent-tb-orange w-4 h-4" @change="cart.toggleAll($event.target.checked)" />
          全选
        </label>
        <button class="ml-4 text-sm text-gray-400 hover:text-tb-red" @click="cart.clearSelected()">删除选中</button>
        <div class="ml-auto flex items-center gap-6">
          <span class="text-sm text-gray-500">已选 <span class="text-tb-orange font-bold">{{ cart.selectedCount }}</span> 件</span>
          <div>
            <span class="text-sm text-gray-500">合计（不含运费）：</span>
            <span class="price text-2xl">¥{{ cart.totalAmount.toFixed(2) }}</span>
          </div>
          <button class="btn-primary text-lg px-12 py-3 rounded-full" @click="checkout">去结算</button>
        </div>
      </div>
    </div>

    <!-- 空车 -->
    <div v-else class="bg-white rounded-lg shadow-card py-24 text-center">
      <div class="text-6xl mb-3">🛒</div>
      <p class="text-gray-400 mb-4">购物车还是空的，快去挑选心仪的商品吧~</p>
      <button class="btn-primary" @click="router.push('/')">去逛逛</button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
