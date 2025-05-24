import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Website } from '@/types/websites.types.ts'

export const useWebsitesStore = defineStore('websites', () => {
  const websites = ref<Website[] | null>(null)

  function setWebsites(w: Website[]) {
    websites.value = w
  }

  return {
    websites,
    setWebsites,
  }
})
