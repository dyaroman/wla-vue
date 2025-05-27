<script setup lang="ts">
import { onUnmounted } from 'vue'

import { useColumnsStore } from '@/stores/columns.store.ts'
import { useWebsitesStore } from '@/stores/websites.store.ts'
import { useFiltersStore } from '@/stores/filters.store.ts'

const columnsStore = useColumnsStore()
const websitesStore = useWebsitesStore()
const filtersStore = useFiltersStore()

onUnmounted(() => filtersStore.cleanup())
</script>

<template>
  <section class="table">
    <table>
      <thead>
        <tr>
          <th v-for="column in columnsStore.visibleOrdered" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in websitesStore.filteredItems" :key="item.website">
          <td v-for="column in columnsStore.visibleOrdered" :key="column">
            {{ item[column] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
