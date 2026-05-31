import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";

import { useColumnsStore } from "@/stores/columns.store";
import { useWebsitesStore } from "@/stores/websites.store.js";
import { getQueryParamValue, getUniqueValues } from "@/misc/helpers";
import { replaceQueryParams } from "@/composables/useQueryParamSync.js";
import { useUrlSync } from "@/composables/useUrlSync.js";

export const useFiltersStore = defineStore("filters", () => {
  const columnsStore = useColumnsStore();
  const websitesStore = useWebsitesStore();

  const values = ref({});
  const autocompleteLists = ref({});
  // Column queued by a table quick-search (Alt+click) so the filters drawer can
  // select that input once it has finished opening; null when nothing is queued.
  const pendingFocusFilter = ref(null);
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
  const { guardWriter } = useUrlSync(initializeValues);
  watch(
    values,
    guardWriter((newFilters) => {
      // null clears the key; an empty filter clears its param.
      const updates = {};
      for (const filter in newFilters) {
        updates[filter] = newFilters[filter] !== "" ? newFilters[filter] : null;
      }
      replaceQueryParams(updates);
    }),
    {
      deep: true,
    },
  );

  return {
    autocompleteLists,
    initializeValues,
    isPristine,
    pendingFocusFilter,
    resetAll,
    values,
  };
});
