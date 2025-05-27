import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import { useColumnsStore } from '@/stores/columns.store.ts'
import { getQueryParamValue } from '@/misc/helpers.ts'

export const useFiltersStore = defineStore(STORE_NAMES.FILTERS, () => {
  const columnsStore = useColumnsStore()

  const values = ref<{ [key: ColumnName]: string }>({})
  const isUpdatingFromUrl = ref(false)

  function initializeValues() {
    const initialValues = {}
    columnsStore.filterable.forEach((filter) => {
      initialValues[filter] = getQueryParamValue(filter) ?? ''
    })
    values.value = initialValues
  }

  function resetAll() {
    const newValues = {}
    columnsStore.filterable.forEach((filter) => {
      newValues[filter] = ''
    })
    values.value = newValues
  }

  function cleanup() {
    if (typeof window !== 'undefined') window.removeEventListener('popstate', _handlePopState)
  }

  // update URL when filters change
  watch(
    values,
    (newFilters) => {
      if (isUpdatingFromUrl.value) return

      const params = _filtersToString(newFilters)
      const newUrl = params ? `${window.location.pathname}?${params}` : window.location.pathname

      window.history.replaceState(null, '', newUrl)
    },
    {
      deep: true,
      flush: 'post',
    },
  )

  function _filtersToString(filters) {
    const params = new URLSearchParams()

    for (const filter in filters) {
      if (filters[filter] !== '') params.set(filter, filters[filter])
    }

    return params.toString()
  }

  function _handlePopState() {
    isUpdatingFromUrl.value = true

    initializeValues()

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false
    })
  }

  if (typeof window !== 'undefined') window.addEventListener('popstate', _handlePopState)

  return { values, initializeValues, cleanup, resetAll }
})
