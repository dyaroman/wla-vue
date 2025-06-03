<script setup>
import { onUnmounted } from 'vue'

import { useColumnsStore } from '@/stores/columns.store'
import { useWebsitesStore } from '@/stores/websites.store'
import { useFiltersStore } from '@/stores/filters.store'
import { useTagsStore } from '@/stores/tags.store'
import { useCheckboxesStore } from '@/stores/checkboxes.store.js'
import { camelCaseToTitleCase } from '@/misc/helpers.js'
import CheckboxComponent from '@/components/CheckboxComponent.vue'

const columnsStore = useColumnsStore()
const websitesStore = useWebsitesStore()
const filtersStore = useFiltersStore()
const tagsStore = useTagsStore()
const checkboxesStore = useCheckboxesStore()

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
              {{ websitesStore.filteredItems.indexOf(item) + 1 }}
            </template>
            <template v-else-if="column === 'checkbox'">
              <CheckboxComponent
                :checked="
                  checkboxesStore.all ||
                  checkboxesStore.values.has(websitesStore.filteredItems.indexOf(item) + 1)
                "
                @change="checkboxesStore.toggle(websitesStore.filteredItems.indexOf(item) + 1)"
              />
            </template>
            <template v-else>{{ item[column] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <!--  todo: PaginationComponent position=below-->
</template>
