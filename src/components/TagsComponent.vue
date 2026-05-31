<script setup>
import TagsList from "@/components/TagsList.vue";
import { useTagsStore } from "@/stores/tags.store";

const tagsStore = useTagsStore();
</script>

<template>
  <div class="tags">
    <button
      class="btn btn--danger"
      data-qa="reset-tags"
      @click="tagsStore.resetAll()"
      :disabled="tagsStore.isPristine"
    >
      reset tags
    </button>

    <TagsList :items="tagsStore.all" />
  </div>
</template>
