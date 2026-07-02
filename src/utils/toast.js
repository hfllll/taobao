import { reactive } from 'vue'

// 极简全局 Toast
export const toastState = reactive({ list: [] })

let id = 0
export function toast(message, type = 'success') {
  const t = { id: ++id, message, type }
  toastState.list.push(t)
  setTimeout(() => {
    toastState.list = toastState.list.filter((x) => x.id !== t.id)
  }, 2200)
}
