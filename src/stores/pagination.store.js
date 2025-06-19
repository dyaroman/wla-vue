import { computed, nextTick, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useWebsitesStore } from '@/stores/websites.store.js'
import { deleteQueryParam, getQueryParamValue } from '@/misc/helpers.js'
import { PER_PAGE_VALUES } from '@/constants/misc.constants.js'

const defaultCurrentPage = 1
const defaultPerPage = 50

export const usePaginationStore = defineStore('pagination', () => {
  const websitesStore = useWebsitesStore()

  const currentPage = ref()
  const perPage = ref()
  const isUpdatingFromUrl = ref(false)

  const totalPages = computed(() => {
    if (!websitesStore.visibleItems?.length || !perPage.value) return 0
    return Math.ceil(websitesStore.visibleItems.length / perPage.value)
  })
  const indexOfLastItem = computed(() => currentPage.value * perPage.value)
  const indexOfFirstItem = computed(() => indexOfLastItem.value - perPage.value)
  const currentItems = computed(() =>
    websitesStore.visibleItems.slice(indexOfFirstItem.value, indexOfLastItem.value),
  )

  watch([currentPage, perPage], ([newCurrentPage, newPerPage]) => {
    if (isUpdatingFromUrl.value) return

    const params = new URLSearchParams(window.location.search)
    params.delete('currentPage')
    params.delete('perPage')

    if (newCurrentPage !== defaultCurrentPage) params.set('currentPage', newCurrentPage)
    if (newPerPage !== defaultPerPage) params.set('perPage', newPerPage)

    if (params.size === 0) window.history.replaceState(null, '', '/')
    else window.history.replaceState(null, '', `?${decodeURIComponent(params.toString())}`)
  })

  watch(totalPages, (newTotalPages) => {
    if (newTotalPages > 0 && currentPage.value > newTotalPages) currentPage.value = newTotalPages
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

  function _getInitialCurrentPage() {
    const currentPageFromUrl = Number(getQueryParamValue('currentPage'))
    const validatedCurrentPage =
      !isNaN(currentPageFromUrl) && currentPageFromUrl > 0 && currentPageFromUrl < totalPages.value

    if (validatedCurrentPage) return currentPageFromUrl

    deleteQueryParam('currentPage')
    return defaultCurrentPage
  }

  function _getInitialPerPage() {
    const perPageFromUrl = Number(getQueryParamValue('perPage'))
    const validatedPerPage = !isNaN(perPageFromUrl) && PER_PAGE_VALUES.includes(perPageFromUrl)

    if (validatedPerPage) return perPageFromUrl

    deleteQueryParam('perPage')
    return defaultPerPage
  }

  function initializeValues() {
    currentPage.value = _getInitialCurrentPage()
    perPage.value = _getInitialPerPage()
  }

  return {
    cleanup,
    currentItems,
    currentPage,
    initializeValues,
    perPage,
    totalPages,
  }
})
