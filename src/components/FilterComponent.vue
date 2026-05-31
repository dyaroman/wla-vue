<script setup>
import { computed } from "vue";

import { useFiltersStore } from "@/stores/filters.store";
import { camelCaseToKebabCase, camelCaseToTitleCase } from "@/misc/helpers.js";

const props = defineProps({
  name: String,
  placeholder: String,
});
const filtersStore = useFiltersStore();
const autocompleteListName = `${camelCaseToKebabCase(props.name)}-autocomplete-list`;
const autocompleteList = computed(
  () => filtersStore.autocompleteLists[props.name],
);
const showAutocompleteList = computed(
  () =>
    autocompleteList.value?.length > 0 &&
    !autocompleteList.value.find(
      (i) =>
        String(i).toLowerCase() ===
        filtersStore.values[props.name].toLowerCase(),
    ),
);
</script>

<template>
  <div class="filter">
    <label class="filter__title">
      <span class="filter__title-text">{{
        camelCaseToTitleCase(placeholder)
      }}</span>
      <input
        type="text"
        class="input"
        :name
        :list="showAutocompleteList ? autocompleteListName : null"
        :data-qa="camelCaseToKebabCase(name)"
        :class="{ 'input--filled': filtersStore.values[name] }"
        :placeholder="camelCaseToTitleCase(placeholder)"
        v-model="filtersStore.values[name]"
      />
      <datalist v-if="showAutocompleteList" :id="autocompleteListName">
        <option v-for="item in autocompleteList" :key="item" :value="item">
          {{ item }}
        </option>
      </datalist>
    </label>
    <button
      class="btn btn--danger"
      @click="filtersStore.values[name] = ''"
      :disabled="!filtersStore.values[name]"
    >
      x
    </button>
  </div>
</template>
