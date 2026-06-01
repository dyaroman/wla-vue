<script setup>
import ImageWithLoader from "@/components/ImageWithLoader.vue";
import { NO_DATA } from "@/constants/misc.constants.js";

defineProps({
  item: Object,
  column: String,
});
</script>

<template>
  <template v-if="item[column] === NO_DATA">{{ NO_DATA }}</template>
  <ImageWithLoader
    v-else
    :src="`https://${item.host}/${item[column]}`"
    max-height="30px"
  />
</template>
