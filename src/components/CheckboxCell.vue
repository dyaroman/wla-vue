<script setup>
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import { useCheckboxesStore } from "@/stores/checkboxes.store.js";

defineProps({
  item: Object,
  column: String,
});

const checkboxesStore = useCheckboxesStore();
</script>

<template>
  <CheckboxComponent
    name="checkbox-item"
    :checked="checkboxesStore.isChecked(item.website)"
    @change="checkboxesStore.toggle(item.website)"
  />
</template>
