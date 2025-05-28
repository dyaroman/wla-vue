import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import { useFiltersStore } from '@/stores/filters.store.ts'
import { useTagsStore } from '@/stores/tags.store.ts'
import { search } from '@/misc/helpers.ts'
import type { Website } from '@/types/websites.types.ts'

interface FiltersValues {
  [key: string]: string
}

export const useWebsitesStore = defineStore(STORE_NAMES.WEBSITES, () => {
  const filtersStore = useFiltersStore() as { values: FiltersValues }
  const tagsStore = useTagsStore()

  const initialItems = ref<Website[] | null>(null)
  const filteredItems = computed<Website[]>(
    () =>
      initialItems.value?.filter((website: Website): boolean => {
        for (const filter in filtersStore.values) {
          if (['', '=', '==', '!', '!='].includes(filtersStore.values[filter])) continue
          switch (filter) {
            case 'pages':
              break
            default:
              if (
                !website[filter as keyof Website] ||
                !search(website[filter as keyof Website], filtersStore.values[filter])
              )
                return false
          }
        }

        if (tagsStore.included.size === 0 && tagsStore.excluded.size === 0) return true

        const websiteTags = Array.isArray(website.tags) ? website.tags : []

        return (
          [...tagsStore.included].every((id) => websiteTags.includes(id)) &&
          [...tagsStore.excluded].every((id) => !websiteTags.includes(id))
        )
      }) ??
      initialItems.value ??
      [],
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
