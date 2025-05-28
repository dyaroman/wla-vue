import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants'
import { WEBSITES_DATA_FILENAME } from '@/constants/misc.constants'
import { useWebsitesStore } from '@/stores/websites.store'
import { useColumnsStore } from '@/stores/columns.store'

export const useMainStore = defineStore(STORE_NAMES.MAIN, () => {
  const websitesStore = useWebsitesStore()
  const columnsStore = useColumnsStore()

  async function loadCombinedData() {
    try {
      const data = await fetch(
        `${import.meta.env.VITE_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`,
      ).then((res) => res.json())

      if (data.websites) {
        websitesStore.setInitialItems(data.websites)
      }

      if (data.columns) {
        columnsStore.setConfig(data.columns)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to load combined data: ', error.message)
      } else {
        console.error('Failed to load combined data: ', error)
      }
    }
  }

  return { loadCombinedData }
})
