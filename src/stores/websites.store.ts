import { ref } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import type { Website } from '@/types/websites.types.ts'

export const useWebsitesStore = defineStore(STORE_NAMES.WEBSITES, () => {
  const websites = ref<Website[] | null>(null)

  function setWebsites(w: Website[]) {
    websites.value = w
  }

  return {
    websites,
    setWebsites,
  }
})
