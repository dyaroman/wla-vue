import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useColumnsStore } from '@/stores/columns.store.ts'
import { STORE_NAMES } from '@/constants/stores.constants.ts'

export const useFiltersStore = defineStore(STORE_NAMES.FILTERS, () => {
  const columnsStore = useColumnsStore()

  const values = ref<{ [key: ColumnName]: string }>({})

  function initializeValues() {
    const initialValues = {}
    columnsStore.filterable.forEach((filter) => {
      initialValues[filter] = ''
    })
    values.value = initialValues
  }

  return { values, initializeValues }
})
