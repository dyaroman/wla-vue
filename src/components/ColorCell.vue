<script setup>
import { computed } from 'vue'

import { getContrastColor } from '@/misc/helpers.js'

const props = defineProps({
  item: Object,
  column: String,
})

const bgColor = computed(() => props.item[props.column.replace('Theme', 'PrimaryColor')])
</script>

<template>
  <div
    class="color-cell"
    :style="{
      'background-color': bgColor !== 'no_data' ? bgColor : null,
      color: bgColor !== 'no_data' ? getContrastColor(bgColor) : null,
    }"
  >
    {{ item[column] }}
  </div>
</template>
