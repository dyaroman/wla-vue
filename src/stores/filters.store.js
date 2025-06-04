import { ref, watch, nextTick, computed } from 'vue'
import { defineStore } from 'pinia'

import { useColumnsStore } from '@/stores/columns.store'
import { getQueryParamValue } from '@/misc/helpers'

export const useFiltersStore = defineStore('filters', () => {
  const columnsStore = useColumnsStore()

  const values = ref({})
  const isUpdatingFromUrl = ref(false)
  const isPristine = computed(
    () => Object.values(values.value).filter((i) => i !== '').length === 0,
  )

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

      const params = new URLSearchParams(window.location.search)
      // remove old filters from URL
      Object.keys(values.value).forEach((key) => params.delete(key))

      // set new filters to URL
      for (const filter in newFilters) {
        if (newFilters[filter] !== '') params.set(filter, newFilters[filter])
      }

      if (params.size === 0) window.history.replaceState(null, '', '/')
      else window.history.replaceState(null, '', `?${decodeURIComponent(params.toString())}`)
    },
    {
      deep: true,
    },
  )

  function _handlePopState() {
    isUpdatingFromUrl.value = true

    initializeValues()

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false
    })
  }

  if (typeof window !== 'undefined') window.addEventListener('popstate', _handlePopState)

  return {
    cleanup,
    initializeValues,
    isPristine,
    resetAll,
    values,
  }
})
