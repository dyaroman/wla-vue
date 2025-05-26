import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { STORE_NAMES } from '@/constants/stores.constants.ts'
import { COLUMNS_CONSTANTS } from '@/constants/columns.constants.ts'
import { useFiltersStore } from '@/stores/filters.store.ts'
import { getQueryParamValue } from '@/misc/helpers.ts'
import type { ColumnConfig, ColumnName, ColumnsConfig } from '@/types/columns.types.ts'

export const useColumnsStore = defineStore(STORE_NAMES.COLUMNS, () => {
  const filtersStore = useFiltersStore()

  const config = ref<ColumnsConfig | null>(null)
  const visible = ref<Set<ColumnName>>(new Set())
  const visibleOrdered = computed<ColumnName[]>(() => {
    if (!config.value) return []
    return Object.keys(config.value).filter((columnName: ColumnName) =>
      visible.value.has(columnName),
    )
  })
  const defaultVisible = computed<ColumnName[]>(() =>
    Object.entries(config.value)
      .filter(([, config]: [ColumnName, ColumnConfig]) => config.showColumn)
      .map(([name]) => name),
  )
  const displayable = computed<ColumnName[]>(() =>
    Object.entries(config.value)
      .filter(
        ([name, config]: [ColumnName, ColumnConfig]) => name !== 'tags' && config.renderColumn,
      )
      .map(([name]) => name),
  )
  const filterable = computed<ColumnName[]>(() =>
    Object.entries(config.value)
      .filter(
        ([name, config]: [ColumnName, ColumnConfig]) => name !== 'tags' && config.renderFilter,
      )
      .map(([name]) => name),
  )

  function setConfig(c: ColumnsConfig) {
    config.value = c
    _initializeVisible()
    filtersStore.initializeValues()
  }

  function toggleVisible(name: ColumnName) {
    if (visible.value.has(name)) visible.value.delete(name)
    else visible.value.add(name)
  }

  function _initializeVisible() {
    const visibleColumns = getQueryParamValue(COLUMNS_CONSTANTS.QUERY_PARAMS.VISIBLE_COLUMNS)

    if (visibleColumns === COLUMNS_CONSTANTS.PRESETS.NONE) visible.value = new Set()
    else if (visibleColumns === COLUMNS_CONSTANTS.PRESETS.ALL)
      visible.value = new Set(displayable.value)
    else if (visibleColumns) visible.value = new Set(visibleColumns.split(',')) as Set<ColumnName>
    else visible.value = new Set(defaultVisible.value)
  }

  return {
    // config,
    // visible,
    visibleOrdered,

    // defaultVisible,
    displayable,
    filterable,

    setConfig,
    // toggleVisible,
  }
})
