import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { useFiltersStore } from "@/stores/filters.store";
import { useTagsStore } from "@/stores/tags.store";
import { useSortStore } from "@/stores/sort.store.js";
import { search, sort } from "@/misc/helpers";

export const useWebsitesStore = defineStore("websites", () => {
  const filtersStore = useFiltersStore();
  const tagsStore = useTagsStore();
  const sortStore = useSortStore();

  const initialItems = ref(null);
  const visibleItems = computed(() => {
    const filteredItems =
      initialItems.value?.filter((website) => {
        for (const filter in filtersStore.values) {
          if (["", "=", "==", "!", "!="].includes(filtersStore.values[filter]))
            continue;
          switch (filter) {
            case "pages":
              break;
            default:
              if (
                !website[filter] ||
                !search(website[filter], filtersStore.values[filter])
              )
                return false;
          }
        }

        if (tagsStore.included.size === 0 && tagsStore.excluded.size === 0)
          return true;

        const websiteTags = Array.isArray(website.tags) ? website.tags : [];

        return (
          [...tagsStore.included].every((id) => websiteTags.includes(id)) &&
          [...tagsStore.excluded].every((id) => !websiteTags.includes(id))
        );
      }) ??
      initialItems.value ??
      [];

    const sortedItems = sort(filteredItems, sortStore.sort);

    if (sortStore.order === "desc") sortedItems.reverse();

    return sortedItems;
  });

  function setInitialItems(w) {
    initialItems.value = w;
  }

  return {
    initialItems,
    visibleItems,
    setInitialItems,
  };
});
