import { ref } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants'

export const useDrawerStore = defineStore(STORE_NAMES.DRAWER, () => {
  // const openDrawerId = ref(null)
  const openDrawerId = ref('tags')

  return { openDrawerId }
})
