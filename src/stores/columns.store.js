import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import { useFiltersStore } from "@/stores/filters.store";
import { useTagsStore } from "@/stores/tags.store.js";
import { useSortStore } from "@/stores/sort.store.js";
import { usePaginationStore } from "@/stores/pagination.store.js";
import { getQueryParamValue } from "@/misc/helpers";
import { replaceQueryParams } from "@/composables/useQueryParamSync.js";
import { useUrlSync } from "@/composables/useUrlSync.js";

export const useColumnsStore = defineStore("columns", () => {
  const filtersStore = useFiltersStore();
  const tagsStore = useTagsStore();
  const sortsStore = useSortStore();
  const paginationStore = usePaginationStore();

  const config = ref(null);
  const visible = ref(new Set());
  const visibleOrdered = computed(() => {
    if (!config.value) return [];
    return Object.keys(config.value).filter((columnName) =>
      visible.value.has(columnName),
    );
  });
  const defaultVisible = computed(() =>
    Object.entries(config.value ?? {})
      .filter(([, config]) => config["showColumn"])
      .map(([name]) => name),
  );
  const displayable = computed(() =>
    Object.entries(config.value ?? {})
      .filter(([name, config]) => name !== "tags" && config["renderColumn"])
      .map(([name]) => name),
  );
  const filterable = computed(() =>
    Object.entries(config.value ?? {})
      .filter(([name, config]) => name !== "tags" && config["renderFilter"])
      .map(([name]) => name),
  );
  const sortable = computed(() =>
    Object.entries(config.value ?? {})
      .filter(
        ([name, config]) =>
          ![
            "checkbox",
            "favicon",
            "forms",
            "index",
            "ogImage",
            "pages",
          ].includes(name) && config["renderColumn"],
      )
      .map(([name]) => name),
  );

  const { guardWriter } = useUrlSync(_initializeVisible);
  watch(
    visibleOrdered,
    guardWriter((newVisible) => {
      let value = null;
      if (JSON.stringify(newVisible) === JSON.stringify(displayable.value))
        value = "all";
      else if (newVisible.length === 0) value = "none";
      else if (
        JSON.stringify(newVisible) !== JSON.stringify(defaultVisible.value)
      )
        value = newVisible.join(",");

      replaceQueryParams({ visibleColumns: value });
    }),
  );

  function setConfig(c) {
    config.value = c;
    _initializeVisible();
    filtersStore.initializeValues();
    tagsStore.initializeValues();
    sortsStore.initializeValues();
    paginationStore.initializeValues();
  }

  function getState(name) {
    return visible.value.has(name);
  }

  function toggleVisible(name) {
    if (visible.value.has(name)) visible.value.delete(name);
    else visible.value.add(name);
  }

  function _initializeVisible() {
    const visibleColumns = getQueryParamValue("visibleColumns");

    if (visibleColumns === "none") visible.value = new Set();
    else if (visibleColumns === "all")
      visible.value = new Set(displayable.value);
    else if (visibleColumns) visible.value = new Set(visibleColumns.split(","));
    else visible.value = new Set(defaultVisible.value);
  }

  return {
    defaultVisible,
    displayable,
    filterable,
    getState,
    setConfig,
    sortable,
    toggleVisible,
    visible,
    visibleOrdered,
  };
});
