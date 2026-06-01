<script setup>
import HighlightComponent from "@/components/HighlightComponent.vue";
import { useFiltersStore } from "@/stores/filters.store.js";

defineProps({
  item: Object,
  column: String,
});

const filtersStore = useFiltersStore();
</script>

<template>
  <HighlightComponent
    :highlight="filtersStore.values[column]"
    :text="String(item[column])"
  />
</template>
