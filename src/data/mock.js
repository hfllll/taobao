// 纯前端 Mock 数据 —— 无需后端，所有图片使用内联 SVG 生成，保证离线可用

const PALETTE = [
  ['#ff9a9e', '#fad0c4'],
  ['#a18cd1', '#fbc2eb'],
  ['#fbc2eb', '#a6c1ee'],
  ['#ffecd2', '#fcb69f'],
  ['#84fab0', '#8fd3f4'],
  ['#a1c4fd', '#c2e9fb'],
  ['#fddb92', '#d1fdff'],
  ['#f6d365', '#fda085'],
  ['#5ee7df', '#b490ca'],
  ['#c79081', '#dfa579']
]

// 生成一张带文字的渐变 SVG 图片（Base64 内联，离线可用）
export function makeImage(text, seed = 0, w = 400, h = 400) {
  const [c1, c2] = PALETTE[seed % PALETTE.length]
  const short = String(text).slice(0, 6)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' font-size='${Math.round(w / 7)}' fill='rgba(255,255,255,0.92)'
      font-family='PingFang SC,Microsoft YaHei,sans-serif' font-weight='700'
      text-anchor='middle' dominant-baseline='middle'>${short}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const categories = [
  { id: 1, name: '手机数码', icon: '📱', keywords: ['耳机', '手机', '充电', '手表', '平板'] },
  { id: 2, name: '电脑办公', icon: '💻', keywords: ['笔记本', '键盘', '鼠标', '显示器'] },
  { id: 3, name: '家用电器', icon: '🔌', keywords: ['空气炸锅', '扫地机', '电饭煲', '风扇'] },
  { id: 4, name: '服饰鞋包', icon: '👗', keywords: ['卫衣', '运动鞋', '连衣裙', '背包'] },
  { id: 5, name: '美妆护肤', icon: '💄', keywords: ['口红', '面膜', '精华', '香水'] },
  { id: 6, name: '食品生鲜', icon: '🍎', keywords: ['坚果', '咖啡', '零食', '茶叶'] },
  { id: 7, name: '家居家装', icon: '🛋️', keywords: ['台灯', '收纳', '床品', '香薰'] },
  { id: 8, name: '运动户外', icon: '⚽', keywords: ['瑜伽垫', '哑铃', '帐篷', '水杯'] }
]

const BRANDS = ['优品', '尚酷', 'MELO', '云希', '木也', 'PANDA', '轻岛', 'GEEK']

const PRODUCT_TEMPLATES = [
  { c: 1, n: '主动降噪蓝牙耳机', p: 299, o: 499, desc: '42dB深度降噪，Hi-Res音质认证，单次续航8小时，Type-C快充。' },
  { c: 1, n: '5G全网通智能手机', p: 2699, o: 3299, desc: '6.7英寸OLED直屏，5000mAh大电池，1亿像素主摄。' },
  { c: 1, n: '65W氮化镓快充充电器', p: 89, o: 149, desc: '双口输出，小巧便携，兼容手机/平板/笔记本。' },
  { c: 1, n: '运动健康智能手表', p: 599, o: 899, desc: '血氧心率监测，100+运动模式，14天超长续航。' },
  { c: 1, n: '轻薄护眼平板电脑', p: 1899, o: 2299, desc: '11英寸2.5K全面屏，四扬声器，支持手写笔。' },
  { c: 2, n: '轻薄商务笔记本电脑', p: 4599, o: 5299, desc: '14英寸2.8K屏，16G+512G，全金属机身1.3kg。' },
  { c: 2, n: '机械键盘热插拔RGB', p: 259, o: 399, desc: 'Gasket结构，客制化手感，三模连接。' },
  { c: 2, n: '人体工学无线鼠标', p: 129, o: 199, desc: '静音微动，可充电，多设备一键切换。' },
  { c: 2, n: '27英寸2K高刷显示器', p: 999, o: 1399, desc: '165Hz电竞屏，IPS广色域，升降旋转支架。' },
  { c: 3, n: '大容量空气炸锅', p: 259, o: 399, desc: '5L可视窗，无油低脂，一键智能菜单。' },
  { c: 3, n: '扫拖一体扫地机器人', p: 1299, o: 1999, desc: 'LDS激光导航，自动集尘，APP远程操控。' },
  { c: 3, n: 'IH电饭煲智能预约', p: 399, o: 599, desc: '厚釜内胆，柴火饭工艺，3-4人家用。' },
  { c: 3, n: '静音塔式循环扇', p: 199, o: 329, desc: '直流变频，遥控定时，广角送风。' },
  { c: 4, n: '纯棉宽松连帽卫衣', p: 139, o: 259, desc: '380g加厚面料，落肩版型，情侣同款。' },
  { c: 4, n: '透气缓震运动跑鞋', p: 329, o: 499, desc: '飞织鞋面，回弹中底，轻盈舒适。' },
  { c: 4, n: '法式复古碎花连衣裙', p: 218, o: 399, desc: '收腰显瘦，垂感雪纺，度假必备。' },
  { c: 4, n: '大容量防泼水双肩背包', p: 169, o: 289, desc: '15.6寸电脑仓，USB充电孔，通勤旅行两用。' },
  { c: 5, n: '丝绒雾面哑光口红', p: 99, o: 169, desc: '不拔干持久显白，多色号可选。' },
  { c: 5, n: '玻尿酸补水面膜', p: 89, o: 159, desc: '大分子锁水，敏感肌适用，一盒10片。' },
  { c: 5, n: '烟酰胺修护精华液', p: 159, o: 259, desc: '提亮肤色，收缩毛孔，温和不刺激。' },
  { c: 5, n: '持久淡香氛香水', p: 259, o: 429, desc: '前调柑橘后调木质，30ml中性香。' },
  { c: 6, n: '每日坚果混合装', p: 69, o: 119, desc: '7种坚果果干，独立小包装，健康零食。' },
  { c: 6, n: '精品挂耳手冲咖啡', p: 79, o: 129, desc: '中深烘焙，10片装，办公室提神。' },
  { c: 6, n: '网红休闲零食大礼包', p: 59, o: 99, desc: '30包混合口味，追剧必备解馋。' },
  { c: 6, n: '高山明前绿茶礼盒', p: 188, o: 328, desc: '手工采摘，清香回甘，送礼佳品。' },
  { c: 7, n: '护眼学习LED台灯', p: 129, o: 219, desc: '国AA级照度，无频闪，三档色温调节。' },
  { c: 7, n: '多层抽屉收纳柜', p: 99, o: 169, desc: '加厚塑料，防潮防尘，卧室卫生间通用。' },
  { c: 7, n: '亲肤纯棉四件套', p: 199, o: 359, desc: '128支高密面料，裸睡级柔软，多花色。' },
  { c: 7, n: '无火香薰藤条礼盒', p: 79, o: 139, desc: '天然精油，持久留香，改善空间氛围。' },
  { c: 8, n: '加厚防滑瑜伽垫', p: 89, o: 159, desc: 'TPE环保材质，6mm回弹，附绑带。' },
  { c: 8, n: '可调节包胶哑铃', p: 149, o: 259, desc: '一对装，防滑手柄，家用力量训练。' },
  { c: 8, n: '全自动户外露营帐篷', p: 299, o: 499, desc: '3-4人速开，防雨防晒，双门透气。' },
  { c: 8, n: '大容量运动保温杯', p: 79, o: 139, desc: '316不锈钢，24小时保温，吨吨桶设计。' }
]

// 生成完整商品库（每个模板扩展为若干规格/品牌，凑够更真实的数量）
function buildProducts() {
  const list = []
  let id = 100
  PRODUCT_TEMPLATES.forEach((t, ti) => {
    const variants = 2 + (ti % 3) // 2~4 个变体
    for (let v = 0; v < variants; v++) {
      id++
      const brand = BRANDS[(ti + v) % BRANDS.length]
      const name = `${brand} ${t.n}`
      const price = +(t.p * (0.9 + v * 0.08)).toFixed(0)
      const original = +(t.o * (0.9 + v * 0.08)).toFixed(0)
      const sales = Math.floor(200 + Math.random() * 9800)
      const rating = +(4.3 + Math.random() * 0.7).toFixed(1)
      list.push({
        id,
        name,
        brand,
        categoryId: t.c,
        price,
        originalPrice: original,
        description: t.desc,
        images: [
          makeImage(brand, id, 500, 500),
          makeImage(t.n, id + 1, 500, 500),
          makeImage(name, id + 2, 500, 500)
        ],
        stock: Math.floor(5 + Math.random() * 300),
        sales,
        rating,
        reviewCount: Math.floor(sales * (0.2 + Math.random() * 0.3)),
        tags: v === 0 ? ['包邮', '7天无理由'] : ['包邮', '假一赔十'],
        specs: {
          品牌: brand,
          发货地: ['广东深圳', '浙江杭州', '江苏苏州', '上海'][id % 4],
          保修: '一年质保',
          规格: ['标准版', '升级版', '尊享版', '限定版'][v % 4]
        }
      })
    }
  })
  return list
}

export const products = buildProducts()

const REVIEW_TEXTS = [
  '质量很好，物流也快，包装严实，非常满意的一次购物！',
  '性价比很高，和描述的一样，会回购的。',
  '用了几天来评价，体验超出预期，推荐购买。',
  '外观好看，做工精细，客服态度也很好。',
  '发货速度快，东西不错，就是包装可以再好点。',
  '整体满意，细节还能再优化，总体给好评。',
  '朋友推荐买的，果然没让我失望，好用！',
  '第二次购买了，一如既往的好，信赖这家店。'
]
const REVIEW_USERS = ['小明***', 'tb_诗诗', '爱购物的猫', '数码***达人', '木子***', 'Lucky***', '一只柠檬', '路人***甲']

export function makeReviews(productId, count = 6) {
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({
      id: productId * 100 + i,
      user: REVIEW_USERS[(productId + i) % REVIEW_USERS.length],
      avatar: makeImage('用户', productId + i, 80, 80),
      rating: 4 + (i % 2),
      content: REVIEW_TEXTS[(productId + i) % REVIEW_TEXTS.length],
      date: `2026-0${1 + (i % 6)}-${10 + i} 1${i % 9}:2${i % 6}`,
      spec: ['标准版', '升级版', '尊享版'][i % 3],
      images: i % 3 === 0 ? [makeImage('晒图', productId + i, 200, 200), makeImage('实拍', productId + i + 5, 200, 200)] : []
    })
  }
  return arr
}

// 默认收货地址（Mock）
export const defaultAddresses = [
  { id: 201, name: '张小明', phone: '138****8888', region: '广东省 深圳市 南山区', detail: '科技园软件产业基地 5 栋 A 座 1801', isDefault: true },
  { id: 202, name: '李华', phone: '139****6666', region: '浙江省 杭州市 余杭区', detail: '文一西路 969 号 阿里巴巴西溪园区', isDefault: false }
]

export const banners = [
  { id: 1, title: '618 年中大促', sub: '全场低至 5 折 · 跨店满 300 减 50', img: makeImage('618大促', 1, 1000, 360), color: 'from-tb-orange to-tb-red' },
  { id: 2, title: '数码狂欢节', sub: '新机首发 · 至高优惠 1000 元', img: makeImage('数码节', 3, 1000, 360), color: 'from-purple-500 to-pink-500' },
  { id: 3, title: '生鲜直供', sub: '产地直发 · 次日达 · 坏果包赔', img: makeImage('生鲜节', 5, 1000, 360), color: 'from-green-500 to-teal-400' }
]
