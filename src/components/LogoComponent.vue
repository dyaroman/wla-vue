<script setup>
import { useMainStore } from '@/stores/main.store'

const mainStore = useMainStore()

function scrollToTop() {
  document.querySelector('.table')?.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <button
    type="button"
    class="logo"
    :class="{ 'logo--fallback': mainStore.dataSource === 'fallback' }"
    aria-label="scroll table to top"
    @click="scrollToTop"
  >
    WL<span>A</span>
  </button>
</template>
