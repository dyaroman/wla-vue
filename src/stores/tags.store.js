import { computed, ref, readonly } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants'
import { CHECKBOX_STATES } from '@/constants/checkbox.constants'
import { useWebsitesStore } from '@/stores/websites.store'
import { getUniqueTags } from '@/misc/helpers'

export const useTagsStore = defineStore(STORE_NAMES.TAGS, () => {
  const websitesStore = useWebsitesStore()

  const all = computed(() => getUniqueTags(websitesStore.initialItems))
  const available = computed(() => getUniqueTags(websitesStore.filteredItems))
  const included = ref(new Set())
  const excluded = ref(new Set())

  function getState(id) {
    if (included.value.has(id)) return CHECKBOX_STATES.INCLUDE
    if (excluded.value.has(id)) return CHECKBOX_STATES.EXCLUDE
    return CHECKBOX_STATES.IGNORE
  }

  function toggleState(id) {
    const currentState = getState(id)

    included.value.delete(id)
    excluded.value.delete(id)

    switch (currentState) {
      case CHECKBOX_STATES.IGNORE:
        included.value.add(id)
        break
      case CHECKBOX_STATES.INCLUDE:
        excluded.value.add(id)
        break
      case CHECKBOX_STATES.EXCLUDE:
        break
    }
  }

  function setState(id, state) {
    included.value.delete(id)
    excluded.value.delete(id)

    if (state === CHECKBOX_STATES.INCLUDE) included.value.add(id)
    else if (state === CHECKBOX_STATES.EXCLUDE) excluded.value.add(id)
  }

  return {
    all,
    available,
    excluded: readonly(excluded),
    getState,
    included: readonly(included),
    setState,
    toggleState,
  }
})
