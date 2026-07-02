import { products } from '@/data/mock'

// 智能推荐引擎（纯前端模拟）—— 混合推荐策略：内容推荐 + 物品协同过滤 + 热度加权
// 对应需求 F-10 / 2.1 AI工具

const maxSales = Math.max(...products.map((p) => p.sales))

// 热度分：销量 + 评分归一化
function hotScore(p) {
  return (p.sales / maxSales) * 0.6 + (p.rating / 5) * 0.4
}

// 基于内容：与用户偏好分类/价格段的相似度
function contentScore(p, prefCats, avgPrice) {
  let s = 0
  const catWeight = prefCats[p.categoryId] || 0
  s += catWeight * 0.7
  if (avgPrice > 0) {
    const priceDiff = Math.abs(p.price - avgPrice) / avgPrice
    s += Math.max(0, 1 - priceDiff) * 0.3 // 价格越接近偏好越高
  }
  return s
}

// 物品协同过滤（简化模拟）："看了X的用户也看了同类热销品"
function itemCFScore(p, viewedProducts) {
  if (!viewedProducts.length) return 0
  const viewedCats = viewedProducts
    .map((id) => products.find((x) => x.id === id))
    .filter(Boolean)
    .map((x) => x.categoryId)
  return viewedCats.includes(p.categoryId) ? 0.5 + Math.random() * 0.3 : 0
}

/**
 * 生成推荐列表
 * @param {object} userStore 包含 viewedCategories / viewedProducts / purchasedProducts
 * @param {number} limit 数量
 * @returns {{list: Array, coldStart: boolean}}
 */
export function recommend(userStore, limit = 10) {
  const viewedCategories = userStore.viewedCategories || {}
  const viewedProducts = userStore.viewedProducts || []
  const purchasedProducts = userStore.purchasedProducts || []

  const hasHistory = Object.keys(viewedCategories).length > 0 || purchasedProducts.length > 0
  const coldStart = !hasHistory

  // 归一化偏好分类权重
  const totalCat = Object.values(viewedCategories).reduce((a, b) => a + b, 0) || 1
  const prefCats = {}
  Object.keys(viewedCategories).forEach((k) => {
    prefCats[k] = viewedCategories[k] / totalCat
  })

  // 偏好平均价格
  const viewedList = viewedProducts.map((id) => products.find((x) => x.id === id)).filter(Boolean)
  const avgPrice = viewedList.length ? viewedList.reduce((s, p) => s + p.price, 0) / viewedList.length : 0

  const scored = products
    .filter((p) => !purchasedProducts.includes(p.id)) // 过滤已购买
    .map((p) => {
      const content = contentScore(p, prefCats, avgPrice)
      const cf = itemCFScore(p, viewedProducts)
      const hot = hotScore(p)
      // 混合加权：冷启动时以热度为主
      const score = coldStart ? hot : content * 0.45 + cf * 0.3 + hot * 0.25

      // 推荐理由标签
      let reason = '热销好评'
      if (!coldStart) {
        if (content > 0.3 && prefCats[p.categoryId]) reason = '根据你的浏览偏好推荐'
        else if (cf > 0) reason = '看了相似商品的人也在看'
        else reason = '为你精选的热门好物'
      }
      return { ...p, _score: score, reason }
    })
    .sort((a, b) => b._score - a._score)

  return { list: scored.slice(0, limit), coldStart }
}

// 相关商品推荐（详情页 "看了又看"）—— 同类目、价格相近、排除自身
export function relatedProducts(product, limit = 6) {
  if (!product) return []
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, limit)
}
