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
  <ul>
    <li v-for="page in item.pages" :key="page">
      <a
        :href="`https://${item.host}/${page === 'index' ? '' : page}`"
        target="_blank"
      >
        <HighlightComponent
          :highlight="filtersStore.values.pages"
          :text="page"
        />
      </a>
    </li>
  </ul>
</template>
