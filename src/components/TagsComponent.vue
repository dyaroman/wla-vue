<script setup lang="ts">
import TagsList from '@/components/TagsList.vue'
import { useTagsStore } from '@/stores/tags.store.ts'

const tagsStore = useTagsStore()
</script>

<template>
  <div class="tags">
    <!--  todo @click=resetTags-->
    <button class="btn btn--danger" data-qa="resetTags">reset tags</button>

    <TagsList :items="tagsStore.all" />
  </div>
</template>
