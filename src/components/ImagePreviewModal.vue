<script setup>
import { computed } from "vue";

import ModalComponent from "@/components/ModalComponent.vue";
import ImageWithLoader from "@/components/ImageWithLoader.vue";
import { useModalStore } from "@/stores/modal.store.js";
import { MODAL_ID } from "@/constants/modal.constants.js";

const modalStore = useModalStore();
const src = computed(() => modalStore.previewImageSrc);
</script>

<template>
  <ModalComponent :id="MODAL_ID.IMAGE_PREVIEW" size="xl" title="Image preview">
    <div class="image-preview" v-if="src">
      <ImageWithLoader :src="src" max-width="100%" max-height="80vh" />
    </div>
  </ModalComponent>
</template>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
}
</style>
