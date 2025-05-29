<script setup>
import TagsList from '@/components/TagsList.vue'
import { useTagsStore } from '@/stores/tags.store'

const tagsStore = useTagsStore()
</script>

<template>
  <div class="tags">
    <button class="btn btn--danger" data-qa="resetTags" @click="tagsStore.resetAll()">
      reset tags
    </button>

    <TagsList :items="tagsStore.all" />
  </div>
</template>
