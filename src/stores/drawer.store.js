import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', () => {
  const openDrawerId = ref(null)

  return { openDrawerId }
})
