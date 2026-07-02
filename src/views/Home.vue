<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { categories, products, banners } from '@/data/mock'
import { recommend } from '@/utils/recommend'
import { useUserStore } from '@/store/user'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const user = useUserStore()

// 轮播
const cur = ref(0)
let timer
onMounted(() => {
  timer = setInterval(() => (cur.value = (cur.value + 1) % banners.length), 4000)
  refreshRec()
})
onUnmounted(() => clearInterval(timer))

// 限时秒杀（取销量最高的几款打折）
const flashSale = computed(() =>
  [...products].sort((a, b) => b.sales - a.sales).slice(0, 6)
)

// 猜你喜欢
const rec = ref({ list: [], coldStart: true })
function refreshRec() {
  rec.value = recommend(user, 12)
}

function goCategory(id) {
  router.push({ name: 'search', query: { category: id } })
}
</script>

<template>
  <div class="container-main py-4">
    <!-- 顶部：分类 + 轮播 -->
    <div class="flex gap-3">
      <!-- 侧边分类 -->
      <div class="w-52 bg-white rounded-lg shadow-card py-2 shrink-0">
        <div
          v-for="c in categories"
          :key="c.id"
          class="group flex items-center justify-between px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition"
          @click="goCategory(c.id)"
        >
          <span class="text-sm text-gray-700 group-hover:text-tb-orange">{{ c.icon }} {{ c.name }}</span>
          <span class="text-gray-300 group-hover:text-tb-orange">›</span>
        </div>
      </div>

      <!-- 轮播 -->
      <div class="flex-1 relative rounded-lg overflow-hidden shadow-card h-[360px]">
        <transition-group name="slide">
          <div
            v-for="(b, i) in banners"
            v-show="i === cur"
            :key="b.id"
            class="absolute inset-0 bg-gradient-to-r flex items-center px-16"
            :class="b.color"
          >
            <div class="text-white">
              <h2 class="text-5xl font-extrabold drop-shadow">{{ b.title }}</h2>
              <p class="text-xl mt-4 opacity-90">{{ b.sub }}</p>
              <button
                class="mt-6 bg-white text-tb-red px-8 py-2.5 rounded-full font-bold hover:scale-105 transition"
                @click="router.push('/search')"
              >
                立即抢购 →
              </button>
            </div>
          </div>
        </transition-group>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <span
            v-for="(b, i) in banners"
            :key="b.id"
            class="w-2.5 h-2.5 rounded-full cursor-pointer transition"
            :class="i === cur ? 'bg-white w-6' : 'bg-white/50'"
            @click="cur = i"
          ></span>
        </div>
      </div>

      <!-- 右侧用户卡片 -->
      <div class="w-56 bg-white rounded-lg shadow-card p-4 shrink-0 flex flex-col">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-tb-gray flex items-center justify-center text-2xl">
            {{ user.isLoggedIn ? '😊' : '👤' }}
          </div>
          <div class="text-sm">
            <template v-if="user.isLoggedIn">
              <p class="font-medium">Hi，{{ user.profile.nickname }}</p>
              <p class="text-gray-400 text-xs">欢迎回来~</p>
            </template>
            <template v-else>
              <p class="text-gray-500">Hi，你好</p>
              <router-link to="/login" class="text-tb-orange text-xs">登录/注册</router-link>
            </template>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-4 text-center text-xs text-gray-500">
          <router-link to="/orders" class="hover:text-tb-orange"><div class="text-lg">📋</div>订单</router-link>
          <router-link to="/cart" class="hover:text-tb-orange"><div class="text-lg">🛒</div>购物车</router-link>
          <a class="hover:text-tb-orange cursor-pointer"><div class="text-lg">❤️</div>收藏</a>
        </div>
        <div class="mt-4 pt-4 border-t border-dashed text-xs text-gray-400 leading-5">
          🎁 新人专享：登录后解锁<span class="text-tb-orange">「智能个性化推荐」</span>
        </div>
      </div>
    </div>

    <!-- 分类金刚区 -->
    <div class="bg-white rounded-lg shadow-card mt-3 grid grid-cols-8 py-4">
      <div
        v-for="c in categories"
        :key="c.id"
        class="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition"
        @click="goCategory(c.id)"
      >
        <div class="text-3xl">{{ c.icon }}</div>
        <span class="text-xs text-gray-600">{{ c.name }}</span>
      </div>
    </div>

    <!-- 限时秒杀 -->
    <div class="bg-white rounded-lg shadow-card mt-3 p-4">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xl font-extrabold text-tb-red">⚡ 限时秒杀</span>
        <span class="bg-tb-dark text-white text-xs px-2 py-1 rounded">距结束 12:34:56</span>
        <span class="text-xs text-gray-400">手慢无，抢到就是赚到</span>
      </div>
      <div class="grid grid-cols-6 gap-3">
        <ProductCard v-for="p in flashSale" :key="p.id" :product="p" />
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <div class="mt-6">
      <div class="flex items-center justify-center gap-3 mb-1">
        <span class="h-px w-16 bg-gradient-to-r from-transparent to-tb-orange"></span>
        <h2 class="text-2xl font-extrabold text-tb-dark">猜你喜欢</h2>
        <span class="h-px w-16 bg-gradient-to-l from-transparent to-tb-orange"></span>
      </div>
      <p class="text-center text-xs text-gray-400 mb-4">
        <template v-if="rec.coldStart">🔥 全站热销推荐 · 浏览更多商品后，将为您提供个性化推荐</template>
        <template v-else>🎯 基于你的浏览记录 · 智能混合推荐（内容 + 协同过滤 + 热度）</template>
      </p>
      <div class="grid grid-cols-6 gap-3">
        <ProductCard v-for="p in rec.list" :key="p.id" :product="p" :reason="p.reason" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.6s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
