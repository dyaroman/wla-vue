<script setup>
import { useWebsitesStore } from "@/stores/websites.store.js";

defineProps({
  item: Object,
  column: String,
});

const websitesStore = useWebsitesStore();
</script>

<template>{{ websitesStore.positionOf(item) }}</template>
