<script setup>
import { computed, onMounted, onUnmounted } from "vue";

import HeaderComponent from "@/components/HeaderComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import EmptyState from "@/components/EmptyState.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import CommandPalette from "@/components/CommandPalette.vue";
import ToastComponent from "@/components/ToastComponent.vue";
import HowToModal from "@/components/HowToModal.vue";
import ImagePreviewModal from "@/components/ImagePreviewModal.vue";
import { useMainStore } from "@/stores/main.store";
import { useColumnsStore } from "@/stores/columns.store.js";
import { useWebsitesStore } from "@/stores/websites.store.js";

const mainStore = useMainStore();
const columnsStore = useColumnsStore();
const websitesStore = useWebsitesStore();

const showTable = computed(
  () =>
    websitesStore.visibleItems.length > 0 &&
    columnsStore.visibleOrdered.length > 0,
);

// re-check for fresher backend data when the tab returns after a long absence
let hiddenAt = 0;

function onVisibilityChange() {
  if (document.hidden) {
    hiddenAt = Date.now();
  } else if (Date.now() - hiddenAt >= mainStore.inactivityThreshold) {
    hiddenAt = Date.now();
    mainStore.checkForUpdates();
  }
}

onMounted(async () => {
  document.addEventListener("visibilitychange", onVisibilityChange);
  await mainStore.loadCombinedData();
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
});
</script>

<template>
  <LoaderComponent fixed v-if="mainStore.appState === 'loading'" />
  <section
    v-else-if="mainStore.appState === 'success'"
    data-qa="app"
    class="app"
  >
    <HeaderComponent />
    <template v-if="showTable">
      <PaginationComponent />
      <TableComponent />
    </template>
    <EmptyState v-else-if="websitesStore.visibleItems.length === 0">
      No results match your filters or selected tags. Try adjusting them.
    </EmptyState>
    <EmptyState v-else-if="columnsStore.visibleOrdered.length === 0">
      No columns are currently visible. Please select at least one column to
      display the table.
    </EmptyState>
    <FooterComponent />
    <CommandPalette />
    <ToastComponent />
    <HowToModal />
    <ImagePreviewModal />
  </section>
  <template v-else-if="mainStore.appState === 'error'">
    <EmptyState
      >Failed to load required data. Please try again later.</EmptyState
    >
  </template>
  <template v-else>
    <EmptyState>Fail to init app: unknown state</EmptyState>
  </template>
</template>
