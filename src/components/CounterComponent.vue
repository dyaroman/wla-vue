<script setup>
import { useWebsitesStore } from '@/stores/websites.store'

const websiteStore = useWebsitesStore()
</script>

<template>
  <div class="counter" data-qa="counter">
    {{ websiteStore.filteredItems.length }}/{{ websiteStore.initialItems?.length }}
  </div>
</template>
