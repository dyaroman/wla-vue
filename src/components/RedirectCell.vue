<script setup>
import DefaultCell from "@/components/DefaultCell.vue";
import { NO_DATA } from "@/constants/misc.constants.js";

defineProps({
  item: Object,
  column: String,
});
</script>

<template>
  <a
    v-if="item[column] !== NO_DATA"
    :href="item[column]"
    target="_blank"
    rel="noreferrer"
    >{{ item[column].replace("https://", "").replace("/", "") }}</a
  >
  <DefaultCell v-else :item :column />
</template>
