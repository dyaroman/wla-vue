<script setup>
import { useWebsitesStore } from '@/stores/websites.store'

const websitesStore = useWebsitesStore()
</script>

<template>
  <div class="counter" data-qa="counter">
    <template v-if="websitesStore.visibleItems.length < websitesStore.initialItems.length">
      {{ websitesStore.visibleItems.length }}/{{ websitesStore.initialItems.length }}
    </template>
    <template v-else>
      {{ websitesStore.initialItems.length }}
    </template>
  </div>
</template>
