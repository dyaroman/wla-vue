import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import { useFiltersStore } from '@/stores/filters.store.ts'
import { search } from '@/misc/helpers.ts'
import type { Website } from '@/types/websites.types.ts'

export const useWebsitesStore = defineStore(STORE_NAMES.WEBSITES, () => {
  const filtersStore = useFiltersStore()

  const initialItems = ref<Website[] | null>(null)
  const filteredItems = computed<Website[]>(() =>
    initialItems.value.filter<Website>((website) => {
      for (const filter in filtersStore.values) {
        if (['', '=', '==', '!', '!='].includes(filtersStore.values[filter])) continue
        switch (filter) {
          case 'pages':
            break
          default:
            if (!website[filter] || !search(website[filter], filtersStore.values[filter]))
              return false
        }
      }
      // todo: filter by tags
      return true
    }),
  )

  function setInitialItems(w: Website[]) {
    initialItems.value = w
  }

  return {
    initialItems,
    filteredItems,
    setInitialItems,
  }
})
