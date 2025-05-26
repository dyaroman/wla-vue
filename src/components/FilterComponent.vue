<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters.store.ts'

defineProps<{
  name: string
  placeholder: string
}>()

const filtersStore = useFiltersStore()
</script>

<template>
  <div class="filter">
    <label class="filter__title">
      <span class="filter__title-text">{{ placeholder }}</span>
      <input
        type="text"
        class="input"
        :name
        :data-qa="name"
        :class="{ 'input--filled': filtersStore.values[name] }"
        :placeholder
        v-model="filtersStore.values[name]"
      />
      <!--      todo: autocomplete-list-->
    </label>
    <!--    todo: @click="resetFilter"-->
    <!--    todo: disabled="!filters[name]"-->
    <button class="btn btn--danger">x</button>
  </div>
</template>
