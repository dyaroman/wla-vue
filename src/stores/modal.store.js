import { defineStore } from "pinia";
import { ref } from "vue";

import { MODAL_ID } from "@/constants/modal.constants.js";

export const useModalStore = defineStore("modal", () => {
  const openModalId = ref(null);
  const previewImageSrc = ref(null);

  function openImagePreview(src) {
    previewImageSrc.value = src;
    openModalId.value = MODAL_ID.IMAGE_PREVIEW;
  }

  return { openImagePreview, openModalId, previewImageSrc };
});
