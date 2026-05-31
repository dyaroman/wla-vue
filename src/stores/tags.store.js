import { computed, ref, readonly, nextTick, watch } from "vue";
import { defineStore } from "pinia";

import { CHECKBOX_STATES } from "@/constants/checkbox.constants";
import { useWebsitesStore } from "@/stores/websites.store";
import { getQueryParamValue, getUniqueTags } from "@/misc/helpers";
import {
  onPopState,
  replaceQueryParams,
} from "@/composables/useQueryParamSync.js";

export const useTagsStore = defineStore("tags", () => {
  const websitesStore = useWebsitesStore();

  const isUpdatingFromUrl = ref(false);
  const all = computed(() => getUniqueTags(websitesStore.initialItems));
  const available = computed(() => getUniqueTags(websitesStore.visibleItems));
  const included = ref(new Set());
  const excluded = ref(new Set());
  const isPristine = computed(
    () => included.value.size === 0 && excluded.value.size === 0,
  );

  watch(
    [included, excluded],
    ([newIncluded, newExcluded]) => {
      if (isUpdatingFromUrl.value) return;

      const tags =
        newIncluded.size > 0 || newExcluded.size > 0
          ? [...newIncluded, ...newExcluded]
              .map((tag) => (excluded.value.has(tag) ? `!${tag}` : tag))
              .join(",")
          : null;

      replaceQueryParams({ tags });
    },
    {
      deep: true,
    },
  );

  function initializeValues() {
    const tagsFromUrl = getQueryParamValue("tags");
    if (!tagsFromUrl) return;

    const newIncluded = new Set();
    const newExcluded = new Set();
    tagsFromUrl.split(",").forEach((tag) => {
      if (tag.startsWith("!")) newExcluded.add(tag.slice(1));
      else newIncluded.add(tag);
    });

    if (newIncluded.size > 0) included.value = newIncluded;
    if (newExcluded.size > 0) excluded.value = newExcluded;
  }

  function getState(id) {
    if (included.value.has(id)) return CHECKBOX_STATES.INCLUDE;
    if (excluded.value.has(id)) return CHECKBOX_STATES.EXCLUDE;
    return CHECKBOX_STATES.IGNORE;
  }

  function toggleState(id) {
    const currentState = getState(id);

    included.value.delete(id);
    excluded.value.delete(id);

    switch (currentState) {
      case CHECKBOX_STATES.IGNORE:
        included.value.add(id);
        break;
      case CHECKBOX_STATES.INCLUDE:
        excluded.value.add(id);
        break;
      case CHECKBOX_STATES.EXCLUDE:
        break;
    }
  }

  function resetAll() {
    included.value = new Set();
    excluded.value = new Set();
  }

  function setState(id, state) {
    included.value.delete(id);
    excluded.value.delete(id);

    if (state === CHECKBOX_STATES.INCLUDE) included.value.add(id);
    else if (state === CHECKBOX_STATES.EXCLUDE) excluded.value.add(id);
  }

  onPopState(_handlePopState);

  function _handlePopState() {
    isUpdatingFromUrl.value = true;

    initializeValues();

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false;
    });
  }

  return {
    all,
    available,
    excluded: readonly(excluded),
    getState,
    included: readonly(included),
    initializeValues,
    isPristine,
    resetAll,
    setState,
    toggleState,
  };
});
