<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { products, categories } from '@/data/mock'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()

const keyword = ref(route.query.keyword || '')
const activeCat = ref(route.query.category ? Number(route.query.category) : 0)
const minPrice = ref('')
const maxPrice = ref('')
const sort = ref('comprehensive') // comprehensive/sales/priceAsc/priceDesc/rating
const page = ref(1)
const pageSize = 20

// 同步路由变化（点击导航分类/搜索）
watch(
  () => route.query,
  (q) => {
    keyword.value = q.keyword || ''
    activeCat.value = q.category ? Number(q.category) : 0
    page.value = 1
  }
)

const sortOptions = [
  { key: 'comprehensive', label: '综合' },
  { key: 'sales', label: '销量' },
  { key: 'priceAsc', label: '价格↑' },
  { key: 'priceDesc', label: '价格↓' },
  { key: 'rating', label: '评分' }
]

const filtered = computed(() => {
  let list = products.slice()
  const kw = keyword.value.trim()
  if (kw) list = list.filter((p) => p.name.includes(kw) || p.description.includes(kw) || p.brand.includes(kw))
  if (activeCat.value) list = list.filter((p) => p.categoryId === activeCat.value)
  const min = parseFloat(minPrice.value)
  const max = parseFloat(maxPrice.value)
  if (!isNaN(min)) list = list.filter((p) => p.price >= min)
  if (!isNaN(max)) list = list.filter((p) => p.price <= max)

  switch (sort.value) {
    case 'sales':
      list.sort((a, b) => b.sales - a.sales)
      break
    case 'priceAsc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'priceDesc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    default:
      list.sort((a, b) => b.sales * b.rating - a.sales * a.rating)
  }
  return list
})

const total = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

function applyFilter() {
  page.value = 1
}
function resetFilter() {
  minPrice.value = ''
  maxPrice.value = ''
  activeCat.value = 0
  page.value = 1
}
function setSort(k) {
  sort.value = k
  page.value = 1
}
function setCat(id) {
  activeCat.value = activeCat.value === id ? 0 : id
  page.value = 1
}
</script>

<template>
  <div class="container-main py-4">
    <!-- 面包屑 -->
    <div class="text-xs text-gray-400 mb-3">
      <router-link to="/" class="hover:text-tb-orange">首页</router-link>
      <span class="mx-1">/</span>
      <span>搜索结果</span>
      <span v-if="keyword" class="text-tb-orange"> “{{ keyword }}”</span>
    </div>

    <!-- 筛选栏 -->
    <div class="bg-white rounded-lg shadow-card p-4 space-y-3">
      <div class="flex items-start gap-3 text-sm">
        <span class="text-gray-400 shrink-0 w-14 pt-1">分类</span>
        <div class="flex flex-wrap gap-2">
          <span
            class="px-3 py-1 rounded cursor-pointer transition"
            :class="activeCat === 0 ? 'bg-tb-orange text-white' : 'bg-gray-100 text-gray-600 hover:text-tb-orange'"
            @click="setCat(0)"
            >全部</span
          >
          <span
            v-for="c in categories"
            :key="c.id"
            class="px-3 py-1 rounded cursor-pointer transition"
            :class="activeCat === c.id ? 'bg-tb-orange text-white' : 'bg-gray-100 text-gray-600 hover:text-tb-orange'"
            @click="setCat(c.id)"
            >{{ c.icon }} {{ c.name }}</span
          >
        </div>
      </div>

      <div class="flex items-center gap-3 text-sm">
        <span class="text-gray-400 shrink-0 w-14">排序</span>
        <div class="flex gap-2">
          <span
            v-for="o in sortOptions"
            :key="o.key"
            class="px-3 py-1 rounded cursor-pointer transition"
            :class="sort === o.key ? 'bg-tb-orange text-white' : 'bg-gray-100 text-gray-600 hover:text-tb-orange'"
            @click="setSort(o.key)"
            >{{ o.label }}</span
          >
        </div>
        <div class="flex items-center gap-2 ml-6">
          <span class="text-gray-400">价格</span>
          <input v-model="minPrice" type="number" placeholder="¥" class="w-20 border rounded px-2 py-1 text-xs outline-none focus:border-tb-orange" />
          <span class="text-gray-300">—</span>
          <input v-model="maxPrice" type="number" placeholder="¥" class="w-20 border rounded px-2 py-1 text-xs outline-none focus:border-tb-orange" />
          <button class="bg-tb-orange text-white text-xs px-3 py-1 rounded" @click="applyFilter">确定</button>
          <button class="text-gray-400 text-xs px-2 hover:text-tb-orange" @click="resetFilter">重置</button>
        </div>
      </div>
    </div>

    <div class="text-xs text-gray-400 my-3">共找到 <span class="text-tb-orange font-medium">{{ total }}</span> 件商品</div>

    <!-- 商品网格 -->
    <div v-if="paged.length" class="grid grid-cols-5 gap-3">
      <ProductCard v-for="p in paged" :key="p.id" :product="p" />
    </div>
    <div v-else class="bg-white rounded-lg shadow-card py-24 text-center text-gray-400">
      <div class="text-5xl mb-3">🔍</div>
      未找到相关商品，试试其他关键词吧
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
      <button class="px-3 py-1.5 bg-white rounded shadow-card text-sm disabled:opacity-40" :disabled="page === 1" @click="page--">上一页</button>
      <button
        v-for="n in totalPages"
        :key="n"
        class="w-9 h-9 rounded text-sm transition"
        :class="n === page ? 'bg-tb-orange text-white' : 'bg-white shadow-card hover:text-tb-orange'"
        @click="page = n"
      >
        {{ n }}
      </button>
      <button class="px-3 py-1.5 bg-white rounded shadow-card text-sm disabled:opacity-40" :disabled="page === totalPages" @click="page++">下一页</button>
    </div>
  </div>
</template>
