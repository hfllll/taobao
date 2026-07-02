# 淘宝 Demo · 智能在线商城（PC 端 · 前端纯 Demo）

测试自动化
线上网址 https://hfllll.github.io/taobao/

> 需求分析与系统设计任务单 · 第 4 组
> 成员：陈炜 肖至杨 吴望梅 严雪桐 杨茗月 郑玮达 肖家雄

按照 `需求.txt` 实现的 **PC 端仿淘宝** 前端演示项目。**无后端**，所有数据、图片、推荐、支付流程均为浏览器本地 Mock 模拟，数据持久化在 `localStorage`。

## 技术栈

- **Vue 3** + `<script setup>`
- **Vite 5** 构建
- **Vue Router 4**（Hash 路由）
- **Pinia** 状态管理（用户 / 购物车 / 订单）
- **TailwindCSS 3** 样式
- 图片：内联 SVG 渐变生成，**完全离线可用**

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 http://localhost:5173）。

## 已实现的需求功能

| 需求编号 | 功能 | 页面 / 模块 |
| --- | --- | --- |
| F-01/F-02 | 商品搜索、分类筛选、价格区间、多维排序、分页 | `views/Search.vue` |
| F-03 | 购物车：增删改数量、选中、全选、结算 | `views/Cart.vue` + `store/cart.js` |
| F-04 | 下单：收货地址选择/新增、支付方式、库存校验、提交订单 | `views/Checkout.vue` |
| F-05 | 订单状态跟踪（待付款/待发货/已发货/已完成/已取消） | `views/Orders.vue` + `store/order.js` |
| F-08/F-09 | 模拟商家发货、确认收货、取消订单 | `views/Orders.vue` |
| **F-10** | **智能商品推荐（核心特色）**：内容推荐 + 物品协同过滤 + 热度加权 + 冷启动 | `utils/recommend.js` + 首页「猜你喜欢」 |
| F-11 | 用户注册/登录（Mock）、收货地址管理、行为记录 | `views/Login.vue` + `store/user.js` |
| F-12 | 商品评分与文字/图片评价展示 | `views/ProductDetail.vue` |

## 智能推荐说明（对应 2.1 AI 工具）

`utils/recommend.js` 采用混合推荐策略：

1. **基于内容**：根据用户浏览过的分类偏好、价格段计算相似度。
2. **物品协同过滤（ItemCF）**：「看了相似商品的人也在看」。
3. **热度加权**：销量 + 评分归一化重排序。
4. **冷启动**：未登录/无行为记录时展示全站热销，并提示「浏览更多后提供个性化推荐」。
5. **过滤已购买**，附带推荐理由标签。

> 登录后，浏览不同分类的商品详情页会实时改变首页「猜你喜欢」的推荐结果。

## 目录结构

```
src/
├─ components/    公共组件（Header/Footer/ProductCard/Toast）
├─ data/mock.js   商品/分类/评价/地址 Mock 数据 + SVG 图片生成
├─ store/         Pinia（user/cart/order）
├─ utils/         推荐引擎 + Toast
├─ views/         页面（Home/Search/ProductDetail/Cart/Checkout/Orders/Login）
└─ router/        路由 + 登录守卫
```

## 说明

- 本项目为教学演示用途，非真实交易；支付为一键模拟成功。
- 需求文档中提到的移动端组件（Vant）与后端（Spring Boot/MySQL）不在本 Demo 范围内，本 Demo 聚焦 **PC 端前端**。
