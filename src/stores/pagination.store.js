import { computed, nextTick, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useWebsitesStore } from "@/stores/websites.store.js";
import { deleteQueryParam, getQueryParamValue } from "@/misc/helpers.js";
import {
  onPopState,
  replaceQueryParams,
} from "@/composables/useQueryParamSync.js";
import { PER_PAGE_VALUES } from "@/constants/misc.constants.js";

const defaultCurrentPage = 1;
const defaultPerPage = 50;

export const usePaginationStore = defineStore("pagination", () => {
  const websitesStore = useWebsitesStore();

  const currentPage = ref();
  const perPage = ref();
  const isUpdatingFromUrl = ref(false);

  const totalPages = computed(() => {
    if (!websitesStore.visibleItems?.length || !perPage.value) return 0;
    return Math.ceil(websitesStore.visibleItems.length / perPage.value);
  });
  const indexOfLastItem = computed(() => currentPage.value * perPage.value);
  const indexOfFirstItem = computed(
    () => indexOfLastItem.value - perPage.value,
  );
  const currentItems = computed(() =>
    websitesStore.visibleItems.slice(
      indexOfFirstItem.value,
      indexOfLastItem.value,
    ),
  );

  watch([currentPage, perPage], ([newCurrentPage, newPerPage]) => {
    if (isUpdatingFromUrl.value) return;

    replaceQueryParams({
      currentPage:
        newCurrentPage !== defaultCurrentPage ? newCurrentPage : null,
      perPage: newPerPage !== defaultPerPage ? newPerPage : null,
    });
  });

  watch(totalPages, (newTotalPages) => {
    if (newTotalPages > 0 && currentPage.value > newTotalPages)
      currentPage.value = newTotalPages;
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

  function _getInitialCurrentPage() {
    const currentPageFromUrl = Number(getQueryParamValue("currentPage"));
    const validatedCurrentPage =
      !isNaN(currentPageFromUrl) &&
      currentPageFromUrl > 0 &&
      currentPageFromUrl <= totalPages.value;

    if (validatedCurrentPage) return currentPageFromUrl;

    deleteQueryParam("currentPage");
    return defaultCurrentPage;
  }

  function _getInitialPerPage() {
    const perPageFromUrl = Number(getQueryParamValue("perPage"));
    const validatedPerPage =
      !isNaN(perPageFromUrl) && PER_PAGE_VALUES.includes(perPageFromUrl);

    if (validatedPerPage) return perPageFromUrl;

    deleteQueryParam("perPage");
    return defaultPerPage;
  }

  function initializeValues() {
    // perPage must be set first: _getInitialCurrentPage validates against
    // totalPages, which is 0 until perPage is known.
    perPage.value = _getInitialPerPage();
    currentPage.value = _getInitialCurrentPage();
  }

  return {
    currentItems,
    currentPage,
    initializeValues,
    perPage,
    totalPages,
  };
});
