<script setup>
import { watchEffect } from "vue";

import { useWebsitesStore } from "@/stores/websites.store";
import { useMainStore } from "@/stores/main.store.js";

const websitesStore = useWebsitesStore();
const mainStore = useMainStore();

watchEffect(() => {
  let title = "";
  if (websitesStore.visibleItems.length > 0)
    title += `[${websitesStore.visibleItems.length}]`;
  if (mainStore.env) title += `[${mainStore.env}]`;
  if (title.length > 0) title += ": ";
  title += "WLA";
  document.title = title;
});
</script>

<template>
  <div class="counter" data-qa="counter">
    <template
      v-if="
        websitesStore.visibleItems.length < websitesStore.initialItems.length
      "
    >
      {{ websitesStore.visibleItems.length }}/{{
        websitesStore.initialItems.length
      }}
    </template>
    <template v-else>
      {{ websitesStore.initialItems.length }}
    </template>
  </div>
</template>
