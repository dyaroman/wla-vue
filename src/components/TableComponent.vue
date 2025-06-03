<script setup>
import { onUnmounted } from 'vue'

import { useColumnsStore } from '@/stores/columns.store'
import { useWebsitesStore } from '@/stores/websites.store'
import { useFiltersStore } from '@/stores/filters.store'
import { useTagsStore } from '@/stores/tags.store'
import { useCheckboxesStore } from '@/stores/checkboxes.store.js'
import { camelCaseToTitleCase } from '@/misc/helpers.js'
import CheckboxComponent from '@/components/CheckboxComponent.vue'
import FormsCell from '@/components/FormsCell.vue'

const columnsStore = useColumnsStore()
const websitesStore = useWebsitesStore()
const filtersStore = useFiltersStore()
const tagsStore = useTagsStore()
const checkboxesStore = useCheckboxesStore()

function getGlobalIndex(item) {
  return websitesStore.filteredItems.indexOf(item) + 1
}

function isChecked(item) {
  return checkboxesStore.all || checkboxesStore.values.has(getGlobalIndex(item))
}

onUnmounted(() => {
  filtersStore.cleanup()
  tagsStore.cleanup()
  columnsStore.cleanup()
})
</script>

<template>
  <!--  todo: PaginationComponent position=above-->
  <section class="table">
    <table>
      <thead>
        <tr>
          <th
            v-for="column in columnsStore.visibleOrdered"
            :key="column"
            :style="{ width: ['index', 'checkbox'].includes(column) ? 0 : null }"
          >
            <template v-if="column === 'index'">#</template>
            <template v-else-if="column === 'checkbox'">
              <CheckboxComponent
                :checked="checkboxesStore.all"
                @change="checkboxesStore.toggleAll(!checkboxesStore.all)"
              />
            </template>
            <template v-else>{{ camelCaseToTitleCase(column) }}</template>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in websitesStore.filteredItems" :key="item.website">
          <td v-for="column in columnsStore.visibleOrdered" :key="column">
            <template v-if="column === 'index'">
              {{ getGlobalIndex(item) }}
            </template>
            <CheckboxComponent
              v-else-if="column === 'checkbox'"
              :checked="isChecked(item)"
              @change="checkboxesStore.toggle(getGlobalIndex(item))"
            />
            <FormsCell v-else-if="column === 'forms'" :item />
            <template v-else>{{ item[column] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <!--  todo: PaginationComponent position=below-->
</template>
