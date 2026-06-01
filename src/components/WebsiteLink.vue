<script setup>
import HighlightComponent from "@/components/HighlightComponent.vue";
import { useFiltersStore } from "@/stores/filters.store.js";

defineProps({
  item: Object,
  // Unused, but declared so the shared cell contract ({ item, column }) doesn't
  // leak `column` onto the root element as a fallthrough attribute.
  column: String,
});

const filtersStore = useFiltersStore();
</script>

<template>
  <a :href="`https://${item.host}`" target="_blank">
    <HighlightComponent
      :highlight="filtersStore.values.website"
      :text="item.website"
    />
  </a>
</template>
