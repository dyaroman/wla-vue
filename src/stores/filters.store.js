import { ref, watch, nextTick, computed } from "vue";
import { defineStore } from "pinia";

import { useColumnsStore } from "@/stores/columns.store";
import { useWebsitesStore } from "@/stores/websites.store.js";
import { getQueryParamValue, getUniqueValues } from "@/misc/helpers";
import {
  onPopState,
  replaceQueryParams,
} from "@/composables/useQueryParamSync.js";

export const useFiltersStore = defineStore("filters", () => {
  const columnsStore = useColumnsStore();
  const websitesStore = useWebsitesStore();

  const values = ref({});
  const autocompleteLists = ref({});
  const isUpdatingFromUrl = ref(false);
  const isPristine = computed(
    () => Object.values(values.value).filter((i) => i !== "").length === 0,
  );

  function initializeValues() {
    const initialValues = {};
    columnsStore.filterable.forEach((filter) => {
      initialValues[filter] = getQueryParamValue(filter) ?? "";
    });
    values.value = initialValues;

    for (const filter in initialValues) {
      autocompleteLists.value[filter] = getUniqueValues(
        websitesStore.initialItems,
        filter,
      ).sort();
    }
  }

  function resetAll() {
    const newValues = {};
    columnsStore.filterable.forEach((filter) => {
      newValues[filter] = "";
    });
    values.value = newValues;
  }

  // update URL when filters change
  watch(
    values,
    (newFilters) => {
      if (isUpdatingFromUrl.value) return;

      // null clears the key; an empty filter clears its param.
      const updates = {};
      for (const filter in newFilters) {
        updates[filter] = newFilters[filter] !== "" ? newFilters[filter] : null;
      }
      replaceQueryParams(updates);
    },
    {
      deep: true,
    },
  );

  function _handlePopState() {
    isUpdatingFromUrl.value = true;

    initializeValues();

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false;
    });
  }

  onPopState(_handlePopState);

  return {
    autocompleteLists,
    initializeValues,
    isPristine,
    resetAll,
    values,
  };
});
