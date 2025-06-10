import { computed, nextTick, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { deleteQueryParam, getQueryParamValue } from '@/misc/helpers.js'
import { useColumnsStore } from '@/stores/columns.store.js'

const defaultSort = 'website'
const defaultOrder = 'asc'

export const useSortStore = defineStore('sort', () => {
  const columnsStore = useColumnsStore()

  const sort = ref('')
  const order = ref('')
  const isUpdatingFromUrl = ref(false)
  const isPristine = computed(() => sort.value === defaultSort && order.value === defaultOrder)

  function _getInitialSort() {
    const sortFromUrl = getQueryParamValue('sort')
    const validatedSort = columnsStore.sortable.find(
      (item) => item.toLocaleString() === sortFromUrl?.toLowerCase(),
    )

    if (validatedSort) return validatedSort

    deleteQueryParam('sort')
    return defaultSort
  }

  function _getInitialOrder() {
    const orderFromUrl = getQueryParamValue('order')
    const validatedOrder = ['asc', 'desc'].find((item) => item === orderFromUrl?.toLowerCase())

    if (validatedOrder) return validatedOrder

    deleteQueryParam('order')
    return defaultOrder
  }

  function initializeValues() {
    sort.value = _getInitialSort()
    order.value = _getInitialOrder()
  }

  function reset() {
    sort.value = defaultSort
    order.value = defaultOrder
  }

  watch([sort, order], ([newSort, newOrder]) => {
    if (isUpdatingFromUrl.value) return

    const params = new URLSearchParams(window.location.search)
    params.delete('sort')
    params.delete('order')

    if (newSort !== defaultSort) params.set('sort', newSort)
    if (newOrder !== defaultOrder) params.set('order', newOrder)

    if (params.size === 0) window.history.replaceState(null, '', '/')
    else window.history.replaceState(null, '', `?${decodeURIComponent(params.toString())}`)
  })

  function _handlePopState() {
    isUpdatingFromUrl.value = true

    initializeValues()

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false
    })
  }

  if (typeof window !== 'undefined') window.addEventListener('popstate', _handlePopState)

  function cleanup() {
    if (typeof window !== 'undefined') window.removeEventListener('popstate', _handlePopState)
  }

  function _toggleOrder() {
    order.value = order.value === 'asc' ? 'desc' : 'asc'
  }

  function change(newSort) {
    if (!columnsStore.sortable.includes(newSort)) return

    if (newSort === sort.value) _toggleOrder(order.value)
    else {
      sort.value = newSort
      if (order.value === 'desc') order.value = defaultOrder
    }
  }

  return {
    change,
    cleanup,
    initializeValues,
    isPristine,
    order,
    reset,
    sort,
  }
})
