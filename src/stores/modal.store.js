import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const openModalId = ref(null)

  return { openModalId }
})
