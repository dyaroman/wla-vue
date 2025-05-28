import { computed, ref, readonly } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import { CHECKBOX_STATES } from '@/constants/checkbox.constants.ts'
import { useWebsitesStore } from '@/stores/websites.store.ts'
import { getUniqueTags } from '@/misc/helpers.ts'
import type { ThreeStateCheckbox } from '@/types/checkbox.types.ts'

export const useTagsStore = defineStore(STORE_NAMES.TAGS, () => {
  const websitesStore = useWebsitesStore()

  const all = computed<string[]>(() => getUniqueTags(websitesStore.initialItems))
  const available = computed<string[]>(() => getUniqueTags(websitesStore.filteredItems))
  const included = ref(new Set<string>())
  const excluded = ref(new Set<string>())

  function getState(id: string): ThreeStateCheckbox {
    if (included.value.has(id)) return CHECKBOX_STATES.INCLUDE
    if (excluded.value.has(id)) return CHECKBOX_STATES.EXCLUDE
    return CHECKBOX_STATES.IGNORE
  }

  function toggleState(id: string) {
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

  function setState(id: string, state: ThreeStateCheckbox) {
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
