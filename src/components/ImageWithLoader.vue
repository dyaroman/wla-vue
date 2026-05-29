<script setup>
import { onMounted, ref } from "vue";

import Loader from "@/components/LoaderComponent.vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  maxWidth: {
    type: String,
  },
  maxHeight: {
    type: String,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["preview"]);

const isLoading = ref(false);
const isError = ref(false);

function onError() {
  isLoading.value = false;
  isError.value = true;
}

function onPreview() {
  if (props.preview && !isError.value) emit("preview", props.src);
}

function onKeydown(event) {
  if (!props.preview) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onPreview();
  }
}

onMounted(() => {
  isLoading.value = true;
});
</script>

<template>
  <div
    class="image-with-loader"
    :style="{
      'min-width': isLoading ? '80px' : null,
      'min-height': isLoading ? '80px' : null,
    }"
  >
    <Loader v-if="isLoading" />

    <img
      :src
      :alt="isError ? 'failed' : null"
      :style="{
        opacity: isLoading ? 0 : 1,
        'max-width': maxWidth ? maxWidth : null,
        'max-height': maxHeight ? maxHeight : null,
        cursor: preview ? 'pointer' : null,
      }"
      class="img"
      loading="lazy"
      :tabindex="preview ? 0 : null"
      :role="preview ? 'button' : null"
      @load="isLoading = false"
      @error="onError"
      @click="onPreview"
      @keydown="onKeydown"
    />
  </div>
</template>
