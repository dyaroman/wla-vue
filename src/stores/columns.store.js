import { computed, nextTick, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { useFiltersStore } from '@/stores/filters.store'
import { useTagsStore } from '@/stores/tags.store.js'
import { useSortStore } from '@/stores/sort.store.js'
import { usePaginationStore } from '@/stores/pagination.store.js'
import { getQueryParamValue } from '@/misc/helpers'

export const useColumnsStore = defineStore('columns', () => {
  const filtersStore = useFiltersStore()
  const tagsStore = useTagsStore()
  const sortsStore = useSortStore()
  const paginationStore = usePaginationStore()

  const isUpdatingFromUrl = ref(false)
  const config = ref(null)
  const visible = ref(new Set())
  const visibleOrdered = computed(() => {
    if (!config.value) return []
    return Object.keys(config.value).filter((columnName) => visible.value.has(columnName))
  })
  const defaultVisible = computed(() =>
    Object.entries(config.value ?? {})
      .filter(([, config]) => config['showColumn'])
      .map(([name]) => name),
  )
  const displayable = computed(() =>
    Object.entries(config.value ?? {})
      .filter(([name, config]) => name !== 'tags' && config['renderColumn'])
      .map(([name]) => name),
  )
  const filterable = computed(() =>
    Object.entries(config.value ?? {})
      .filter(([name, config]) => name !== 'tags' && config['renderFilter'])
      .map(([name]) => name),
  )
  const sortable = computed(() =>
    Object.entries(config.value ?? {})
      .filter(
        ([name, config]) =>
          !['checkbox', 'favicon', 'forms', 'index', 'ogImage', 'pages'].includes(name) &&
          config['renderColumn'],
      )
      .map(([name]) => name),
  )

  watch(visibleOrdered, (newVisible) => {
    if (isUpdatingFromUrl.value) return

    const params = new URLSearchParams(window.location.search)
    params.delete('visibleColumns')

    let value
    if (JSON.stringify(newVisible) === JSON.stringify(displayable.value)) value = 'all'
    else if (newVisible.length === 0) value = 'none'
    else if (JSON.stringify(newVisible) !== JSON.stringify(defaultVisible.value))
      value = newVisible.join(',')

    if (value) params.set('visibleColumns', value)

    if (params.size === 0) window.history.replaceState(null, '', '/')
    else window.history.replaceState(null, '', `?${decodeURIComponent(params.toString())}`)
  })

  function setConfig(c) {
    config.value = c
    _initializeVisible()
    filtersStore.initializeValues()
    tagsStore.initializeValues()
    sortsStore.initializeValues()
    paginationStore.initializeValues()
  }

  function getState(name) {
    return visible.value.has(name)
  }

  function toggleVisible(name) {
    if (visible.value.has(name)) visible.value.delete(name)
    else visible.value.add(name)
  }

  function _initializeVisible() {
    const visibleColumns = getQueryParamValue('visibleColumns')

    if (visibleColumns === 'none') visible.value = new Set()
    else if (visibleColumns === 'all') visible.value = new Set(displayable.value)
    else if (visibleColumns) visible.value = new Set(visibleColumns.split(','))
    else visible.value = new Set(defaultVisible.value)
  }

  if (typeof window !== 'undefined') window.addEventListener('popstate', _handlePopState)

  function cleanup() {
    if (typeof window !== 'undefined') window.removeEventListener('popstate', _handlePopState)
  }

  function _handlePopState() {
    isUpdatingFromUrl.value = true

    _initializeVisible()

    // reset flag after next tick
    nextTick(() => {
      isUpdatingFromUrl.value = false
    })
  }

  return {
    cleanup,
    defaultVisible,
    displayable,
    filterable,
    getState,
    setConfig,
    sortable,
    toggleVisible,
    visible,
    visibleOrdered,
  }
})
