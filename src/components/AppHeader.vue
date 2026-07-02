<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import { categories } from '@/data/mock'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const user = useUserStore()

const keyword = ref(route.query.keyword || '')
const hotWords = ['蓝牙耳机', '笔记本电脑', '空气炸锅', '运动鞋', '口红', '每日坚果']

function doSearch(kw) {
  const q = (kw ?? keyword.value).trim()
  router.push({ name: 'search', query: q ? { keyword: q } : {} })
}

function goCategory(id) {
  router.push({ name: 'search', query: { category: id } })
}

function logout() {
  user.logout()
  router.push('/')
}
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <!-- 顶部窄条 -->
    <div class="bg-tb-gray border-b border-gray-200 text-xs text-gray-500">
      <div class="container-main flex items-center justify-between h-8">
        <div class="flex items-center gap-3">
          <span class="text-tb-orange font-medium">📍 深圳</span>
          <span>喵，欢迎来逛淘宝Demo</span>
        </div>
        <div class="flex items-center gap-4">
          <template v-if="user.isLoggedIn">
            <span>Hi，{{ user.profile.nickname }}</span>
            <router-link to="/orders" class="hover:text-tb-orange">我的订单</router-link>
            <a class="hover:text-tb-orange cursor-pointer" @click="logout">退出</a>
          </template>
          <template v-else>
            <router-link to="/login" class="hover:text-tb-orange">亲，请登录</router-link>
            <router-link to="/login" class="hover:text-tb-orange">免费注册</router-link>
          </template>
          <span class="text-gray-300">|</span>
          <span>纯前端 Demo · 第4组</span>
        </div>
      </div>
    </div>

    <!-- 主搜索栏 -->
    <div class="container-main flex items-center gap-8 py-4">
      <router-link to="/" class="flex items-center gap-1 shrink-0">
        <span class="text-4xl">🛒</span>
        <div class="leading-tight">
          <div class="text-2xl font-extrabold bg-gradient-to-r from-tb-orange to-tb-red bg-clip-text text-transparent">
            淘宝Demo
          </div>
          <div class="text-[10px] text-gray-400 tracking-widest">Taobao Clone</div>
        </div>
      </router-link>

      <div class="flex-1 max-w-[640px]">
        <div class="flex border-2 border-tb-orange rounded-full overflow-hidden">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索 蓝牙耳机 / 笔记本电脑 / 每日坚果..."
            class="flex-1 px-5 py-2.5 outline-none text-sm"
            @keyup.enter="doSearch()"
          />
          <button class="bg-gradient-to-r from-tb-orange to-tb-red text-white px-8 font-medium" @click="doSearch()">
            🔍 搜索
          </button>
        </div>
        <div class="flex gap-3 mt-1.5 px-2 text-xs text-gray-400">
          <span
            v-for="w in hotWords"
            :key="w"
            class="hover:text-tb-orange cursor-pointer"
            @click="((keyword = w), doSearch(w))"
            >{{ w }}</span
          >
        </div>
      </div>

      <router-link
        to="/cart"
        class="ml-auto relative flex items-center gap-1.5 border border-tb-orange text-tb-orange rounded-full px-5 py-2 hover:bg-orange-50 transition shrink-0"
      >
        <span class="text-lg">🛒</span>
        <span class="text-sm font-medium">购物车</span>
        <span
          v-if="cart.count"
          class="absolute -top-2 -right-2 bg-tb-red text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
          >{{ cart.count }}</span
        >
      </router-link>
    </div>

    <!-- 分类导航 -->
    <nav class="border-t border-gray-100">
      <div class="container-main flex items-center gap-6 h-11 text-sm">
        <router-link to="/" class="font-bold text-tb-orange hover:opacity-80">首页</router-link>
        <a
          v-for="c in categories"
          :key="c.id"
          class="text-gray-600 hover:text-tb-orange cursor-pointer transition"
          @click="goCategory(c.id)"
          >{{ c.icon }} {{ c.name }}</a
        >
      </div>
    </nav>
  </header>
</template>
