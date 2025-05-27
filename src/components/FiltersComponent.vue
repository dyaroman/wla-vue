<script setup lang="ts">
import { useColumnsStore } from '@/stores/columns.store.ts'
import { useFiltersStore } from '@/stores/filters.store.ts'
import FilterComponent from '@/components/FilterComponent.vue'

const columnsStore = useColumnsStore()
const filtersStore = useFiltersStore()

function resetFilters() {
  filtersStore.resetAll()
}
</script>

<template>
  <div class="filters">
    <div class="flex-column">
      <button class="btn btn--danger" data-qa="resetFilters" @click="resetFilters">
        reset filters
      </button>
      <FilterComponent
        v-for="filter in columnsStore.filterable"
        :key="filter"
        :name="filter"
        :placeholder="filter"
      />
    </div>
  </div>
</template>
