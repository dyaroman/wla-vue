<script setup lang="ts">
import { onMounted, ref } from 'vue'

import LoaderComponent from '@/components/LoaderComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import { useMainStore } from '@/stores/main.store.ts'

const appInit = ref(false)
const mainStore = useMainStore()

onMounted(async () => {
  await mainStore.loadCombinedData()
  appInit.value = true
})
</script>

<template>
  <template v-if="appInit">
    <TableComponent />
  </template>
  <LoaderComponent v-else fixed />
</template>
