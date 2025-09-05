<script setup>
import { onMounted, ref } from 'vue'

import Loader from '@/components/LoaderComponent.vue'

defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
  },
  maxHeight: {
    type: String,
  },
})

const isLoading = ref(false)
const isError = ref(false)

function onError() {
  isLoading.value = false
  isError.value = true
}

onMounted(() => {
  isLoading.value = true
})
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
      }"
      class="img"
      loading="lazy"
      @load="isLoading = false"
      @error="onError"
    />
  </div>
</template>
