<script setup>
import { onUnmounted } from "vue";

import { useColumnsStore } from "@/stores/columns.store";
import { useWebsitesStore } from "@/stores/websites.store";
import { useFiltersStore } from "@/stores/filters.store";
import { useTagsStore } from "@/stores/tags.store";
import { useCheckboxesStore } from "@/stores/checkboxes.store.js";
import { useSortStore } from "@/stores/sort.store.js";
import { usePaginationStore } from "@/stores/pagination.store.js";
import { useDrawerStore } from "@/stores/drawer.store";
import { useToastStore } from "@/stores/toast.store.js";
import { useModalStore } from "@/stores/modal.store.js";
import { camelCaseToKebabCase, camelCaseToTitleCase } from "@/misc/helpers.js";
import { NO_DATA } from "@/constants/misc.constants.js";
import { DRAWER_ID } from "@/constants/drawers.constants.js";
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import FormsCell from "@/components/FormsCell.vue";
import WebsiteLink from "@/components/WebsiteLink.vue";
import PagesCell from "@/components/PagesCell.vue";
import ColorCell from "@/components/ColorCell.vue";
import ImageWithLoader from "@/components/ImageWithLoader.vue";
import HighlightComponent from "@/components/HighlightComponent.vue";

const columnsStore = useColumnsStore();
const websitesStore = useWebsitesStore();
const filtersStore = useFiltersStore();
const tagsStore = useTagsStore();
const checkboxesStore = useCheckboxesStore();
const sortStore = useSortStore();
const paginationStore = usePaginationStore();
const drawerStore = useDrawerStore();
const toastStore = useToastStore();
const modalStore = useModalStore();

const SEARCH_SKIP_VALUE_COLUMNS = ["pages", "forms"];
const COPY_SKIP_COLUMNS = ["index", "checkbox", "tags", "favicon", "ogImage"];

function getGlobalIndex(item) {
  return websitesStore.visibleItems.indexOf(item) + 1;
}

function isChecked(item) {
  return (
    checkboxesStore.all || checkboxesStore.values.has(getGlobalIndex(item))
  );
}

// Alt+click a cell -> filter that column by its value; Cmd/Win+click -> copy it.
function onCellClick(event, item, column) {
  if (event.altKey) {
    event.preventDefault();
    quickSearch(item, column);
  } else if (event.metaKey) {
    event.preventDefault();
    quickCopy(event, item, column);
  }
}

function quickSearch(item, column) {
  if (!columnsStore.filterable.includes(column)) return;

  drawerStore.openDrawerId = DRAWER_ID.FILTERS;

  const rawValue = item[column];
  const value =
    SEARCH_SKIP_VALUE_COLUMNS.includes(column) || rawValue === NO_DATA
      ? ""
      : String(rawValue);

  filtersStore.values[column] = value;

  // wait for the drawer to render before focusing the matching input
  setTimeout(() => {
    const input = document.querySelector(
      `.filters input[data-qa="${camelCaseToKebabCase(column)}"]`,
    );
    input?.select();
  }, 300);
}

async function quickCopy(event, item, column) {
  if (COPY_SKIP_COLUMNS.includes(column)) return;

  let value;
  if (column.includes("Theme")) {
    const hex = item[column.replace("Theme", "PrimaryColor")];
    value = hex && hex !== NO_DATA ? hex : NO_DATA;
  } else {
    value = event.currentTarget.innerText.trim();
  }

  try {
    await navigator.clipboard.writeText(value);
    toastStore.show("Copied to clipboard", "success");
  } catch (error) {
    console.warn("Clipboard write failed:", error);
    toastStore.show("Failed to copy to clipboard", "error");
  }
}

onUnmounted(() => {
  filtersStore.cleanup();
  tagsStore.cleanup();
  columnsStore.cleanup();
  sortStore.cleanup();
  paginationStore.cleanup();
});
</script>

<template>
  <section class="table">
    <table>
      <thead>
        <tr>
          <th
            v-for="column in columnsStore.visibleOrdered"
            :key="column"
            :style="{
              width: ['index', 'checkbox'].includes(column) ? 0 : null,
            }"
            :data-sort="columnsStore.sortable.includes(column) ? column : null"
            :data-order="
              column === sortStore.sort && !sortStore.isPristine
                ? sortStore.order
                : null
            "
            @click="
              columnsStore.sortable.includes(column)
                ? sortStore.change(column)
                : null
            "
          >
            <template v-if="column === 'index'">#</template>
            <template v-else-if="column === 'checkbox'">
              <CheckboxComponent
                name="checkbox-all"
                :checked="checkboxesStore.all"
                @change="checkboxesStore.toggleAll(!checkboxesStore.all)"
              />
            </template>
            <template v-else>{{ camelCaseToTitleCase(column) }}</template>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in paginationStore.currentItems" :key="item.website">
          <td
            v-for="column in columnsStore.visibleOrdered"
            :key="column"
            :class="{ 'color-cell': column.includes('Theme') }"
            :data-title="camelCaseToTitleCase(column)"
            @click="onCellClick($event, item, column)"
          >
            <template v-if="column === 'index'">
              {{ getGlobalIndex(item) }}
            </template>
            <CheckboxComponent
              v-else-if="column === 'checkbox'"
              name="checkbox-item"
              :checked="isChecked(item)"
              @change="checkboxesStore.toggle(getGlobalIndex(item))"
            />
            <WebsiteLink v-else-if="column === 'website'" :item />
            <FormsCell v-else-if="column === 'forms'" :item />
            <PagesCell v-else-if="column === 'pages'" :item />
            <ColorCell v-else-if="column.includes('Theme')" :item :column />
            <template
              v-else-if="
                column.includes('Redirect') && item[column] !== NO_DATA
              "
            >
              <a :href="item[column]" target="_blank" rel="noreferrer">{{
                item[column].replace("https://", "").replace("/", "")
              }}</a>
            </template>
            <template v-else-if="column === 'favicon'">
              <template v-if="item[column] === NO_DATA">{{ NO_DATA }}</template>
              <ImageWithLoader
                v-else
                :src="`https://${item.host}/${item[column]}`"
                max-height="30px"
              />
            </template>
            <template v-else-if="column === 'ogImage'">
              <div class="og-images" v-if="item[column]?.length > 0">
                <ImageWithLoader
                  v-for="img in item[column]"
                  :key="img"
                  :src="`https://${item.host}/${img}`"
                  max-height="100px"
                  preview
                  @preview="modalStore.openImagePreview"
                />
              </div>
              <template v-else>{{ NO_DATA }}</template>
            </template>
            <HighlightComponent
              v-else
              :highlight="filtersStore.values[column]"
              :text="String(item[column])"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
