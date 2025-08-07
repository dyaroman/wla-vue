<script setup>
import { computed, onMounted, ref } from 'vue'

import HeaderComponent from '@/components/HeaderComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import EmptyState from '@/components/EmptyState.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { useMainStore } from '@/stores/main.store'
import { useColumnsStore } from '@/stores/columns.store.js'
import { useWebsitesStore } from '@/stores/websites.store.js'

const appInit = ref(false)
const mainStore = useMainStore()
const columnsStore = useColumnsStore()
const websitesStore = useWebsitesStore()

const showTable = computed(
  () => websitesStore.visibleItems.length > 0 && columnsStore.visibleOrdered.length > 0,
)

onMounted(async () => {
  await mainStore.loadCombinedData()
  appInit.value = true
})
</script>

<template>
  <section v-if="appInit" data-qa="app" class="app">
    <HeaderComponent />
    <PaginationComponent v-if="showTable" />
    <TableComponent v-if="showTable" />
    <EmptyState v-else-if="websitesStore.visibleItems.length === 0">
      No results match your filters or selected tags. Try adjusting them.
    </EmptyState>
    <EmptyState v-else-if="columnsStore.visibleOrdered.length === 0">
      No columns are currently visible. Please select at least one column to display the table.
    </EmptyState>
    <FooterComponent />
  </section>
  <LoaderComponent v-else fixed />
</template>

<!--todo: do i need GA or some alternative?-->
