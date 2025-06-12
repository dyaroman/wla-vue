import { ref } from 'vue'
import { defineStore } from 'pinia'

import { WEBSITES_DATA_FILENAME } from '@/constants/misc.constants'
import { useWebsitesStore } from '@/stores/websites.store'
import { useColumnsStore } from '@/stores/columns.store'
import { getQueryParamValue } from '@/misc/helpers'

export const useMainStore = defineStore('main', () => {
  const websitesStore = useWebsitesStore()
  const columnsStore = useColumnsStore()
  const env = ref('')
  const commit = ref('')
  const timestamp = ref('')
  const dataSource = ref('')

  let hostEnv = null
  const subdomain = window.location.hostname.split('.')[0]
  if (['localhost', 'rc', 'dev', 'prod'].includes(subdomain)) {
    hostEnv = subdomain === 'prod' ? 'prod' : 'dev'
  }

  async function _loadData() {
    const primaryEndpoint = `${import.meta.env.VITE_WLA_BACKEND_URL}/combined?env=${hostEnv}`
    const fallbackEndpoint = `${import.meta.env.VITE_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`

    try {
      if (getQueryParamValue('ds') === 'file') throw new Error('Forced to use fallback endpoint')
      if (!hostEnv) throw new Error('Host environment not found')

      const response = await fetch(primaryEndpoint)
      if (!response.ok) {
        throw new Error(
          'Failed to fetch combined data from primary endpoint, status code: ' + response.status,
        )
      }
      dataSource.value = 'primary'
      return await response.json()
    } catch (error) {
      console.warn(
        'Failed to load combined data from primary endpoint, trying fallback:',
        error?.message ?? error,
      )
      try {
        const response = await fetch(fallbackEndpoint)
        if (!response.ok) {
          throw new Error(
            'Failed to fetch combined data from fallback endpoint, status code: ' + response.status,
          )
        }
        dataSource.value = 'fallback'
        return await response.json()
      } catch (fallbackError) {
        throw new Error('Failed to load combined data: ', fallbackError?.message ?? fallbackError)
      }
    }
  }

  async function loadCombinedData() {
    const { websites, columns, ...misc } = await _loadData()

    if (websites) {
      websitesStore.setInitialItems(websites)
    }

    if (columns) {
      columnsStore.setConfig(columns)
    }

    if (misc) {
      env.value = misc.env ?? hostEnv
      commit.value = misc.commit
      timestamp.value = misc.timestamp
    }
  }

  return {
    commit,
    dataSource,
    env,
    loadCombinedData,
    timestamp,
  }
})
