<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products, makeReviews } from '@/data/mock'
import { relatedProducts } from '@/utils/recommend'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const user = useUserStore()

const product = computed(() => products.find((p) => p.id === Number(route.params.id)))
const activeImg = ref(0)
const qty = ref(1)
const tab = ref('detail')

const reviews = computed(() => (product.value ? makeReviews(product.value.id, 8) : []))
const related = computed(() => relatedProducts(product.value, 6))

function track() {
  if (product.value) {
    user.trackView(product.value)
    activeImg.value = 0
    qty.value = 1
  }
}
onMounted(track)
watch(() => route.params.id, track)

function addCart() {
  cart.add(product.value, qty.value)
  toast('已加入购物车')
}
function buyNow() {
  cart.add(product.value, qty.value)
  router.push('/cart')
}
</script>

<template>
  <div v-if="product" class="container-main py-4">
    <div class="text-xs text-gray-400 mb-3">
      <router-link to="/" class="hover:text-tb-orange">首页</router-link>
      <span class="mx-1">/</span>
      <span class="hover:text-tb-orange cursor-pointer" @click="router.push({ name: 'search', query: { category: product.categoryId } })">
        {{ product.specs.品牌 }}
      </span>
      <span class="mx-1">/</span>
      <span class="text-gray-600">{{ product.name }}</span>
    </div>

    <!-- 主信息区 -->
    <div class="bg-white rounded-lg shadow-card p-6 flex gap-8">
      <!-- 图片 -->
      <div class="w-[420px] shrink-0">
        <div class="aspect-square rounded-lg overflow-hidden border">
          <img :src="product.images[activeImg]" class="w-full h-full object-cover" />
        </div>
        <div class="flex gap-2 mt-3">
          <div
            v-for="(img, i) in product.images"
            :key="i"
            class="w-16 h-16 rounded border-2 overflow-hidden cursor-pointer"
            :class="i === activeImg ? 'border-tb-orange' : 'border-transparent'"
            @mouseenter="activeImg = i"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- 信息 -->
      <div class="flex-1">
        <h1 class="text-xl font-medium leading-relaxed">{{ product.name }}</h1>
        <p class="text-sm text-gray-400 mt-1">{{ product.description }}</p>

        <div class="flex items-center gap-6 mt-3 text-xs text-gray-400">
          <span>⭐ 评分 <b class="text-tb-orange">{{ product.rating }}</b></span>
          <span>累计评价 {{ product.reviewCount }}</span>
          <span>已售 {{ product.sales }}</span>
        </div>

        <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mt-4">
          <div class="flex items-end gap-3">
            <span class="text-gray-500 text-sm">促销价</span>
            <span class="price text-3xl">¥{{ product.price }}</span>
            <span class="text-gray-400 line-through text-sm mb-1">¥{{ product.originalPrice }}</span>
            <span class="bg-tb-red text-white text-xs px-2 py-0.5 rounded mb-1">立省 ¥{{ product.originalPrice - product.price }}</span>
          </div>
        </div>

        <div class="mt-4 space-y-2.5 text-sm">
          <div class="flex gap-4"><span class="text-gray-400 w-16">配送</span><span>广东深圳 至 全国 · <span class="text-tb-orange">包邮</span></span></div>
          <div class="flex gap-4"><span class="text-gray-400 w-16">服务</span>
            <span class="flex gap-2">
              <span v-for="t in product.tags" :key="t" class="text-tb-orange">✓ {{ t }}</span>
            </span>
          </div>
          <div class="flex gap-4">
            <span class="text-gray-400 w-16">库存</span>
            <span :class="product.stock < 20 ? 'text-tb-red' : 'text-gray-600'">
              {{ product.stock }} 件{{ product.stock < 20 ? '（即将售罄）' : '' }}
            </span>
          </div>
        </div>

        <!-- 数量 -->
        <div class="flex items-center gap-4 mt-5">
          <span class="text-gray-400 text-sm w-16">数量</span>
          <div class="flex border rounded">
            <button class="w-9 h-9 text-gray-500 hover:text-tb-orange" @click="qty = Math.max(1, qty - 1)">−</button>
            <input v-model.number="qty" class="w-14 text-center border-x outline-none" />
            <button class="w-9 h-9 text-gray-500 hover:text-tb-orange" @click="qty = Math.min(product.stock, qty + 1)">＋</button>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex gap-4 mt-6">
          <button class="btn-primary text-lg px-12 py-3" @click="buyNow">立即购买</button>
          <button class="btn-outline text-lg px-12 py-3" @click="addCart">🛒 加入购物车</button>
        </div>
      </div>
    </div>

    <!-- 详情 / 参数 / 评价 -->
    <div class="bg-white rounded-lg shadow-card mt-3">
      <div class="flex border-b">
        <div
          v-for="t in [['detail', '商品详情'], ['spec', '规格参数'], ['review', `用户评价(${product.reviewCount})`]]"
          :key="t[0]"
          class="px-8 py-3 text-sm cursor-pointer border-b-2 -mb-px transition"
          :class="tab === t[0] ? 'border-tb-orange text-tb-orange font-medium' : 'border-transparent text-gray-500'"
          @click="tab = t[0]"
        >
          {{ t[1] }}
        </div>
      </div>

      <div class="p-6">
        <!-- 详情 -->
        <div v-if="tab === 'detail'" class="space-y-4">
          <p class="text-gray-600 leading-7">{{ product.description }}</p>
          <img v-for="(img, i) in product.images" :key="i" :src="img" class="w-full max-w-[700px] mx-auto rounded-lg" />
        </div>

        <!-- 参数 -->
        <div v-else-if="tab === 'spec'" class="max-w-[600px]">
          <div v-for="(v, k) in product.specs" :key="k" class="flex text-sm border-b last:border-0">
            <span class="w-32 py-3 text-gray-400 bg-gray-50 px-3">{{ k }}</span>
            <span class="flex-1 py-3 px-4 text-gray-700">{{ v }}</span>
          </div>
        </div>

        <!-- 评价 -->
        <div v-else class="space-y-5">
          <div v-for="r in reviews" :key="r.id" class="flex gap-3 border-b pb-4 last:border-0">
            <img :src="r.avatar" class="w-10 h-10 rounded-full" />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">{{ r.user }}</span>
                <span class="text-tb-orange text-xs">{{ '★'.repeat(r.rating) }}<span class="text-gray-300">{{ '★'.repeat(5 - r.rating) }}</span></span>
              </div>
              <p class="text-sm text-gray-700 mt-1">{{ r.content }}</p>
              <div v-if="r.images.length" class="flex gap-2 mt-2">
                <img v-for="(img, i) in r.images" :key="i" :src="img" class="w-16 h-16 rounded object-cover" />
              </div>
              <div class="text-xs text-gray-300 mt-1.5">{{ r.date }} · {{ r.spec }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 看了又看 -->
    <div class="mt-6">
      <h2 class="text-lg font-bold text-tb-dark mb-3">👀 看了又看</h2>
      <div class="grid grid-cols-6 gap-3">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </div>
  </div>

  <div v-else class="container-main py-24 text-center text-gray-400">商品不存在或已下架</div>
</template>
