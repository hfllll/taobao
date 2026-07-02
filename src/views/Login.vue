<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const mode = ref('login') // login / register
const form = ref({ username: '', password: '', confirm: '' })

function submit() {
  if (!form.value.username || !form.value.password) {
    toast('请输入账号和密码', 'error')
    return
  }
  if (mode.value === 'register' && form.value.password !== form.value.confirm) {
    toast('两次密码不一致', 'error')
    return
  }
  user.login(form.value.username)
  toast(mode.value === 'login' ? '登录成功' : '注册并登录成功')
  const redirect = route.query.redirect || '/'
  router.replace(redirect)
}
</script>

<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 py-16">
    <div class="bg-white rounded-2xl shadow-hover w-[820px] flex overflow-hidden">
      <!-- 左侧品牌 -->
      <div class="w-80 bg-gradient-to-br from-tb-orange to-tb-red p-10 text-white flex flex-col justify-center">
        <div class="text-6xl mb-4">🛒</div>
        <h2 class="text-3xl font-extrabold">淘宝Demo</h2>
        <p class="mt-3 text-white/80 leading-6 text-sm">
          登录后解锁「智能个性化推荐」，系统将根据你的浏览与购买行为，为你精选好物。
        </p>
        <div class="mt-8 space-y-2 text-sm text-white/90">
          <p>✓ 海量商品 · 全场包邮</p>
          <p>✓ 智能推荐 · 千人千面</p>
          <p>✓ 7天无理由 · 极速退款</p>
        </div>
      </div>

      <!-- 右侧表单 -->
      <div class="flex-1 p-10">
        <div class="flex gap-6 border-b mb-6">
          <button class="pb-3 text-lg -mb-px border-b-2 transition" :class="mode === 'login' ? 'border-tb-orange text-tb-orange font-medium' : 'border-transparent text-gray-400'" @click="mode = 'login'">登录</button>
          <button class="pb-3 text-lg -mb-px border-b-2 transition" :class="mode === 'register' ? 'border-tb-orange text-tb-orange font-medium' : 'border-transparent text-gray-400'" @click="mode = 'register'">注册</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-xs text-gray-400">账号</label>
            <input v-model="form.username" placeholder="请输入用户名 / 手机号" class="w-full border rounded-lg px-4 py-2.5 mt-1 outline-none focus:border-tb-orange" @keyup.enter="submit" />
          </div>
          <div>
            <label class="text-xs text-gray-400">密码</label>
            <input v-model="form.password" type="password" placeholder="请输入密码" class="w-full border rounded-lg px-4 py-2.5 mt-1 outline-none focus:border-tb-orange" @keyup.enter="submit" />
          </div>
          <div v-if="mode === 'register'">
            <label class="text-xs text-gray-400">确认密码</label>
            <input v-model="form.confirm" type="password" placeholder="请再次输入密码" class="w-full border rounded-lg px-4 py-2.5 mt-1 outline-none focus:border-tb-orange" @keyup.enter="submit" />
          </div>

          <button class="btn-primary w-full py-3 rounded-lg text-lg" @click="submit">
            {{ mode === 'login' ? '登 录' : '注 册' }}
          </button>
          <p class="text-xs text-gray-400 text-center">💡 纯前端 Demo：任意账号密码均可登录</p>
        </div>
      </div>
    </div>
  </div>
</template>
