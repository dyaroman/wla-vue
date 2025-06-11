<script setup>
import { useWebsitesStore } from '@/stores/websites.store'

const websitesStore = useWebsitesStore()
</script>

<template>
  <div class="counter" data-qa="counter">
    {{ websitesStore.visibleItems.length }}/{{ websitesStore.initialItems?.length }}
  </div>
</template>
