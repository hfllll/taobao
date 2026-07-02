<script setup>
import { toastState } from '@/utils/toast'
</script>

<template>
  <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="t in toastState.list"
        :key="t.id"
        class="px-5 py-2.5 rounded-lg text-white text-sm shadow-hover"
        :class="{
          'bg-black/80': t.type === 'success',
          'bg-tb-red/90': t.type === 'error',
          'bg-gray-700/90': t.type === 'info'
        }"
      >
        {{ t.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
