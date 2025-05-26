import { ref } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'

export const useDrawerStore = defineStore(STORE_NAMES.DRAWER, () => {
  const openDrawerId = ref<string | null>(null)

  return { openDrawerId }
})
