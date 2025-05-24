import { ref } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import type { Website } from '@/types/websites.types.ts'

export const useWebsitesStore = defineStore(STORE_NAMES.WEBSITES, () => {
  const items = ref<Website[] | null>(null)

  function setItems(w: Website[]) {
    items.value = w
  }

  return {
    items,
    setItems,
  }
})
