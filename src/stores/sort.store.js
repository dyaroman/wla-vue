import { computed, nextTick, ref, watch } from "vue";
import { defineStore } from "pinia";

import { deleteQueryParam, getQueryParamValue } from "@/misc/helpers.js";
import {
  onPopState,
  replaceQueryParams,
} from "@/composables/useQueryParamSync.js";
import { useColumnsStore } from "@/stores/columns.store.js";

const defaultSort = "website";
const defaultOrder = "asc";

export const useSortStore = defineStore("sort", () => {
  const columnsStore = useColumnsStore();

  const sort = ref("");
  const order = ref("");
  const isUpdatingFromUrl = ref(false);
  const isPristine = computed(
    () => sort.value === defaultSort && order.value === defaultOrder,
  );

  function _getInitialSort() {
    const sortFromUrl = getQueryParamValue("sort");
    const validatedSort = columnsStore.sortable.find(
      (item) => item.toLowerCase() === sortFromUrl?.toLowerCase(),
    );

    if (validatedSort) return validatedSort;

    deleteQueryParam("sort");
    return defaultSort;
  }

  function _getInitialOrder() {
    const orderFromUrl = getQueryParamValue("order");
    const validatedOrder = ["asc", "desc"].find(
      (item) => item === orderFromUrl?.toLowerCase(),
    );

    if (validatedOrder) return validatedOrder;

    deleteQueryParam("order");
    return defaultOrder;
  }

  function initializeValues() {
    sort.value = _getInitialSort();
    order.value = _getInitialOrder();
  }

  function reset() {
    sort.value = defaultSort;
    order.value = defaultOrder;
  }

  watch([sort, order], ([newSort, newOrder]) => {
    if (isUpdatingFromUrl.value) return;

    replaceQueryParams({
      sort: newSort !== defaultSort ? newSort : null,
      order: newOrder !== defaultOrder ? newOrder : null,
    });
  });

  function _handlePopState() {
    isUpdatingFromUrl.value = true;

    initializeValues();

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false;
    });
  }

  onPopState(_handlePopState);

  function _toggleOrder() {
    order.value = order.value === "asc" ? "desc" : "asc";
  }

  function change(newSort) {
    if (!columnsStore.sortable.includes(newSort)) return;

    if (newSort === sort.value) _toggleOrder(order.value);
    else {
      sort.value = newSort;
      if (order.value === "desc") order.value = defaultOrder;
    }
  }

  return {
    change,
    initializeValues,
    isPristine,
    order,
    reset,
    sort,
  };
});
