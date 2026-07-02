<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { toast } from '@/utils/toast'

const props = defineProps({
  product: { type: Object, required: true },
  reason: { type: String, default: '' }
})

const router = useRouter()
const cart = useCartStore()

function go() {
  router.push({ name: 'product', params: { id: props.product.id } })
}
function addCart(e) {
  e.stopPropagation()
  cart.add(props.product, 1)
  toast('已加入购物车')
}
</script>

<template>
  <div
    class="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
    @click="go"
  >
    <div class="relative overflow-hidden aspect-square">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span
        v-if="reason"
        class="absolute top-2 left-2 bg-tb-orange/90 text-white text-[11px] px-2 py-0.5 rounded-full"
        >{{ reason }}</span
      >
      <span
        v-if="product.originalPrice > product.price"
        class="absolute top-2 right-2 bg-tb-red text-white text-[11px] px-1.5 py-0.5 rounded"
        >省¥{{ product.originalPrice - product.price }}</span
      >
    </div>
    <div class="p-3 flex flex-col flex-1">
      <p class="text-sm text-gray-800 line-clamp-2 leading-snug h-10 group-hover:text-tb-orange transition">
        {{ product.name }}
      </p>
      <div class="flex gap-1 mt-1.5">
        <span
          v-for="t in product.tags"
          :key="t"
          class="text-[10px] text-tb-orange border border-orange-200 rounded px-1"
          >{{ t }}</span
        >
      </div>
      <div class="mt-auto pt-2 flex items-end justify-between">
        <div>
          <span class="price text-lg">¥{{ product.price }}</span>
          <span class="text-gray-400 line-through text-xs ml-1">¥{{ product.originalPrice }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-xs text-gray-400 mt-1">
        <span>⭐ {{ product.rating }}</span>
        <span>已售 {{ product.sales }}</span>
      </div>
      <button
        class="mt-2 w-full text-xs bg-orange-50 text-tb-orange rounded-md py-1.5 hover:bg-tb-orange hover:text-white transition"
        @click="addCart"
      >
        加入购物车
      </button>
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
