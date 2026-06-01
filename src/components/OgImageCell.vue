<script setup>
import ImageWithLoader from "@/components/ImageWithLoader.vue";
import { NO_DATA } from "@/constants/misc.constants.js";
import { useModalStore } from "@/stores/modal.store.js";

defineProps({
  item: Object,
  column: String,
});

const modalStore = useModalStore();
</script>

<template>
  <div class="og-images" v-if="item[column]?.length > 0">
    <ImageWithLoader
      v-for="img in item[column]"
      :key="img"
      :src="`https://${item.host}/${img}`"
      max-height="100px"
      preview
      @preview="modalStore.openImagePreview"
    />
  </div>
  <template v-else>{{ NO_DATA }}</template>
</template>
