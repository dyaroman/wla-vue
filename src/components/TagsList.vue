<script setup lang="ts">
import ThreeStateCheckbox from '@/components/ThreeStateCheckbox.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <ul class="tags-list">
    <li v-for="tag in items" :key="tag">
      <ThreeStateCheckbox :name="tag" />
    </li>
  </ul>
</template>
