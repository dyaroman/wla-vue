<script setup>
import { computed } from "vue";

import { useColumnsStore } from "@/stores/columns.store";
import { useWebsitesStore } from "@/stores/websites.store";
import { useFiltersStore } from "@/stores/filters.store";
import { useCheckboxesStore } from "@/stores/checkboxes.store.js";
import { useSortStore } from "@/stores/sort.store.js";
import { usePaginationStore } from "@/stores/pagination.store.js";
import { useDrawerStore } from "@/stores/drawer.store";
import { useToastStore } from "@/stores/toast.store.js";
import { useModalStore } from "@/stores/modal.store.js";
import { camelCaseToTitleCase } from "@/misc/helpers.js";
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
const checkboxesStore = useCheckboxesStore();
const sortStore = useSortStore();
const paginationStore = usePaginationStore();
const drawerStore = useDrawerStore();
const toastStore = useToastStore();
const modalStore = useModalStore();

const SEARCH_SKIP_VALUE_COLUMNS = ["pages", "forms"];
const COPY_SKIP_COLUMNS = ["index", "checkbox", "tags", "favicon", "ogImage"];

// Build the item -> 1-based position map once per visibleItems change, instead
// of an O(n) indexOf per row, per render.
const rowIndexById = computed(() => {
  const map = new Map();
  websitesStore.visibleItems.forEach((item, i) => map.set(item, i + 1));
  return map;
});

function getGlobalIndex(item) {
  return rowIndexById.value.get(item);
}

// "Select all" operates on every row matching the current filters/tags,
// not just the current page.
const visibleIds = computed(() =>
  websitesStore.visibleItems.map((item) => item.website),
);
const allChecked = computed(
  () =>
    visibleIds.value.length > 0 &&
    visibleIds.value.every((id) => checkboxesStore.isChecked(id)),
);

function toggleAll() {
  checkboxesStore.setMany(visibleIds.value, !allChecked.value);
}

// Sortable headers are focusable <th>s: Enter/Space sorts (mirrors @click) and
// aria-sort exposes the current direction to assistive tech.
function onHeaderKeydown(event, column) {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (!columnsStore.sortable.includes(column)) return;
  event.preventDefault();
  sortStore.change(column);
}

function ariaSort(column) {
  if (!columnsStore.sortable.includes(column)) return null;
  if (column !== sortStore.sort || sortStore.isPristine) return "none";
  return sortStore.order === "asc" ? "ascending" : "descending";
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

  const rawValue = item[column];
  const value =
    SEARCH_SKIP_VALUE_COLUMNS.includes(column) || rawValue === NO_DATA
      ? ""
      : String(rawValue);

  filtersStore.values[column] = value;
  // Hand focus off to the filters drawer: it selects this input from its
  // @afterOpen, so focus no longer races a hardcoded drawer-transition delay.
  filtersStore.pendingFocusFilter = column;
  drawerStore.openDrawerId = DRAWER_ID.FILTERS;
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
            :tabindex="columnsStore.sortable.includes(column) ? 0 : null"
            :aria-sort="ariaSort(column)"
            @click="
              columnsStore.sortable.includes(column)
                ? sortStore.change(column)
                : null
            "
            @keydown="onHeaderKeydown($event, column)"
          >
            <template v-if="column === 'index'">#</template>
            <template v-else-if="column === 'checkbox'">
              <CheckboxComponent
                name="checkbox-all"
                :checked="allChecked"
                @change="toggleAll"
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
              :checked="checkboxesStore.isChecked(item.website)"
              @change="checkboxesStore.toggle(item.website)"
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
