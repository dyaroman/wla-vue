<script setup lang="ts">
import { onMounted, ref } from 'vue'

import HeaderComponent from '@/components/HeaderComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { useMainStore } from '@/stores/main.store'

const appInit = ref(false)
const mainStore = useMainStore()

onMounted(async () => {
  await mainStore.loadCombinedData()
  appInit.value = true
})
</script>

<template>
  <section v-if="appInit" data-qa="app" class="app">
    <HeaderComponent />
    <TableComponent />
  </section>
  <LoaderComponent v-else fixed />
</template>
