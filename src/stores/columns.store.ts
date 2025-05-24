import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ColumnName, ColumnsConfig } from '@/types/columns.types.ts'
import { getQueryParamValue } from '@/misc/helpers.ts'

export const useColumnsStore = defineStore('columns', () => {
  const config = ref<ColumnsConfig | null>(null)
  const visible = ref<Set<ColumnName>>(new Set())
  const visibleOrdered = computed(() => {
    if (!config.value) return []
    return Object.keys(config.value).filter((columnName) =>
      visible.value.has(columnName as ColumnName),
    ) as ColumnName[]
  })
  const defaultVisible = computed(
    () =>
      Object.entries(config.value ?? {})
        .filter(([, config]) => config.showColumn)
        .map(([name]) => name) as ColumnName[],
  )
  const displayable = computed(
    () =>
      Object.entries(config.value ?? {})
        .filter(([, config]) => config.renderColumn)
        .map(([name]) => name) as ColumnName[],
  )

  function setConfig(c: ColumnsConfig) {
    config.value = c
    _initializeVisible()
  }

  function toggleVisible(name: ColumnName) {
    if (visible.value.has(name)) visible.value.delete(name)
    else visible.value.add(name)
  }

  function _initializeVisible() {
    const visibleColumns = getQueryParamValue('visibleColumns')

    if (visibleColumns === 'none') visible.value = new Set()
    else if (visibleColumns === 'all') visible.value = new Set(displayable.value)
    else if (visibleColumns) visible.value = new Set(visibleColumns.split(',')) as Set<ColumnName>
    else visible.value = new Set(defaultVisible.value)
  }

  return {
    config,
    visible,
    visibleOrdered,

    defaultVisible,
    displayable,

    setConfig,
    toggleVisible,
  }
})
