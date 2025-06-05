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
import WebsiteLink from '@/components/WebsiteLink.vue'
import PagesCell from '@/components/PagesCell.vue'
import ColorCell from '@/components/ColorCell.vue'
import ImageWithLoader from '@/components/ImageWithLoader.vue'

const columnsStore = useColumnsStore()
const websitesStore = useWebsitesStore()
const filtersStore = useFiltersStore()
const tagsStore = useTagsStore()
const checkboxesStore = useCheckboxesStore()

function getGlobalIndex(item) {
  return websitesStore.visibleItems.indexOf(item) + 1
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
        <tr v-for="item in websitesStore.visibleItems" :key="item.website">
          <td
            v-for="column in columnsStore.visibleOrdered"
            :key="column"
            :class="{ 'color-cell': column.includes('Theme') }"
          >
            <template v-if="column === 'index'">
              {{ getGlobalIndex(item) }}
            </template>
            <CheckboxComponent
              v-else-if="column === 'checkbox'"
              :checked="isChecked(item)"
              @change="checkboxesStore.toggle(getGlobalIndex(item))"
            />
            <WebsiteLink v-else-if="column === 'website'" :item />
            <FormsCell v-else-if="column === 'forms'" :item />
            <PagesCell v-else-if="column === 'pages'" :item />
            <ColorCell v-else-if="column.includes('Theme')" :item :column />
            <template v-else-if="column.includes('Redirect') && item[column] !== 'no_data'">
              <a :href="item[column]" target="_blank" rel="noreferrer">{{
                item[column].replace('https://', '').replace('/', '')
              }}</a>
            </template>
            <ImageWithLoader
              v-else-if="column === 'favicon'"
              :src="`https://${item.host}/${item[column]}`"
              max-height="30px"
            />
            <div class="og-images" v-else-if="column === 'ogImage'">
              <ImageWithLoader
                v-for="img in item[column]"
                :key="img"
                :src="`https://${item.host}/${img}`"
                max-height="100px"
              />
            </div>
            <template v-else>{{ item[column] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <!--  todo: PaginationComponent position=below-->
</template>
