<script setup>
import { computed } from 'vue'

import { getContrastColor } from '@/misc/helpers.js'
import { NO_DATA } from '@/constants/misc.constants.js'

const props = defineProps({
  item: Object,
  column: String,
})

const bgColor = computed(() => props.item[props.column.replace('Theme', 'PrimaryColor')])
</script>

<template>
  <div
    class="color-cell__bg"
    :style="{
      color: bgColor === NO_DATA ? null : getContrastColor(bgColor),
      'background-color': bgColor === NO_DATA ? null : bgColor,
    }"
  >
    {{ item[column] }}
  </div>
</template>
