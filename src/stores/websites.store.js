import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants'
import { useFiltersStore } from '@/stores/filters.store'
import { useTagsStore } from '@/stores/tags.store'
import { search } from '@/misc/helpers'

export const useWebsitesStore = defineStore(STORE_NAMES.WEBSITES, () => {
  const filtersStore = useFiltersStore()
  const tagsStore = useTagsStore()

  const initialItems = ref(null)
  const visibleItems = computed(
    () =>
      initialItems.value?.filter((website) => {
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

  function setInitialItems(w) {
    initialItems.value = w
  }

  return {
    initialItems,
    visibleItems,
    setInitialItems,
  }
})
