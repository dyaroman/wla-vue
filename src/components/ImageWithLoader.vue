<script setup>
import { onMounted, ref, watch, nextTick } from "vue";

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

const imgRef = ref(null);
const isLoading = ref(false);
const isError = ref(false);

// A cached image can already be `complete` before @load would fire, which
// would otherwise leave the loader spinning forever.
function syncLoadingState() {
  isError.value = false;
  const img = imgRef.value;
  isLoading.value = !(img?.complete && img.naturalWidth > 0);
}

function onError() {
  isLoading.value = false;
  isError.value = true;
}

onMounted(syncLoadingState);

// Reset loading/error state when the source changes on a reused instance.
watch(
  () => props.src,
  () => {
    isError.value = false;
    isLoading.value = true;
    nextTick(syncLoadingState);
  },
);

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
      ref="imgRef"
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
