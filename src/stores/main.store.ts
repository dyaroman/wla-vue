import { defineStore } from 'pinia'

import { useWebsitesStore } from '@/stores/websites.store.ts'
import { useColumnsStore } from '@/stores/columns.store.ts'
import { WEBSITES_DATA_FILENAME } from '@/misc/misc.constants.ts'
import type { WebsitesData } from '@/types/websites.types.ts'

export const useMainStore = defineStore('main', () => {
  const websitesStore = useWebsitesStore()
  const columnsStore = useColumnsStore()

  async function loadCombinedData() {
    try {
      const data: WebsitesData = await fetch(
        `${import.meta.env.VITE_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`,
      ).then((res) => res.json())

      if (data.websites) {
        websitesStore.setWebsites(data.websites)
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
