<script setup lang="ts">
import ThreeStateCheckbox from '@/components/ThreeStateCheckbox.vue'
import { useTagsStore } from '@/stores/tags.store.ts'

defineProps<{
  items: string[]
}>()

const tagsStore = useTagsStore()
</script>

<template>
  <ul class="tags-list">
    <li v-for="tag in items" :key="tag">
      <ThreeStateCheckbox :name="tag" />
    </li>
  </ul>
</template>
