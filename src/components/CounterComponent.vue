<script setup lang="ts">
import { useWebsitesStore } from '@/stores/websites.store.ts'

const websiteStore = useWebsitesStore()
</script>

<template>
  <div class="counter" data-qa="counter">
    <!--    todo: preparedData.length / -->
    {{ websiteStore.items?.length }}
  </div>
</template>
