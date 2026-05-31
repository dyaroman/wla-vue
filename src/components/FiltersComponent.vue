<script setup>
import { ref } from "vue";

import { useColumnsStore } from "@/stores/columns.store";
import { useFiltersStore } from "@/stores/filters.store";
import FilterComponent from "@/components/FilterComponent.vue";

const columnsStore = useColumnsStore();
const filtersStore = useFiltersStore();
const rootRef = ref(null);

function resetFilters() {
  filtersStore.resetAll();
}

// The drawer calls this from its @afterOpen, i.e. once the open transition has
// finished and focus has moved into the drawer. If a table quick-search queued
// a column, select its input so the prefilled value is ready to overwrite.
function focusPendingFilter() {
  const column = filtersStore.pendingFocusFilter;
  if (!column) return;

  filtersStore.pendingFocusFilter = null;
  rootRef.value?.querySelector(`input[name="${column}"]`)?.select();
}

defineExpose({ focusPendingFilter });
</script>

<template>
  <div class="filters" ref="rootRef">
    <div class="flex-column">
      <button
        class="btn btn--danger"
        data-qa="reset-filters"
        @click="resetFilters"
        :disabled="filtersStore.isPristine"
      >
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
