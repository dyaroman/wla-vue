import { ref } from 'vue'
import { defineStore } from 'pinia'

import { WEBSITES_DATA_FILENAME } from '@/constants/misc.constants'
import { useWebsitesStore } from '@/stores/websites.store'
import { useColumnsStore } from '@/stores/columns.store'

export const useMainStore = defineStore('main', () => {
  const websitesStore = useWebsitesStore()
  const columnsStore = useColumnsStore()
  const env = ref('')
  const commit = ref('')
  const timestamp = ref('')

  async function loadCombinedData() {
    try {
      const { websites, columns, ...misc } = await fetch(
        `${import.meta.env.VITE_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`,
      ).then((res) => res.json())

      if (websites) {
        websitesStore.setInitialItems(websites)
      }

      if (columns) {
        columnsStore.setConfig(columns)
      }

      if (misc) {
        env.value = misc.env
        commit.value = misc.commit
        timestamp.value = misc.timestamp
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to load combined data: ', error.message)
      } else {
        console.error('Failed to load combined data: ', error)
      }
    }
  }

  return {
    commit,
    env,
    loadCombinedData,
    timestamp,
  }
})
