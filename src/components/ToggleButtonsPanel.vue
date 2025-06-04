<script setup>
import IconFilters from '@/components/icons/IconFilters.vue'
import IconTags from '@/components/icons/IconTags.vue'
import IconColumns from '@/components/icons/IconColumns.vue'
import DrawerComponent from '@/components/DrawerComponent.vue'
import FiltersComponent from '@/components/FiltersComponent.vue'
import TagsComponent from '@/components/TagsComponent.vue'
import ColumnSettings from '@/components/ColumnSettings.vue'
import { DRAWER_ID } from '@/constants/drawers.constants'
import { useDrawerStore } from '@/stores/drawer.store'
import InfoComponent from '@/components/InfoComponent.vue'

defineProps({
  position: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
})

const drawerStore = useDrawerStore()
</script>

<template>
  <div class="flex-row">
    <template v-if="position === 'left'">
      <button class="burger" data-qa="burger" @click="drawerStore.openDrawerId = DRAWER_ID.SIDEBAR">
        <span /><span /><span />
      </button>
      <DrawerComponent :id="DRAWER_ID.SIDEBAR" position="left" max-size="320px" title="Sidebar">
        <InfoComponent />
      </DrawerComponent>

      <button
        class="btn btn--icon"
        aria-label="filters"
        data-qa="filters"
        @click="drawerStore.openDrawerId = DRAWER_ID.FILTERS"
      >
        <IconFilters />
      </button>
      <DrawerComponent :id="DRAWER_ID.FILTERS" position="left" max-size="500px" title="Filters">
        <FiltersComponent />
      </DrawerComponent>
    </template>

    <template v-if="position === 'right'">
      <button
        class="btn btn--icon"
        aria-label="tags"
        data-qa="tags"
        @click="drawerStore.openDrawerId = DRAWER_ID.TAGS"
      >
        <IconTags />
      </button>
      <DrawerComponent :id="DRAWER_ID.TAGS" position="right" max-size="320px" title="Tags">
        <TagsComponent />
      </DrawerComponent>

      <button
        class="btn btn--icon"
        aria-label="customize columns"
        data-qa="customize-columns"
        @click="drawerStore.openDrawerId = DRAWER_ID.CUSTOMIZE_COLUMNS"
      >
        <IconColumns />
      </button>
      <DrawerComponent
        :id="DRAWER_ID.CUSTOMIZE_COLUMNS"
        position="right"
        max-size="320px"
        title="Customize columns"
      >
        <ColumnSettings />
      </DrawerComponent>
    </template>
  </div>
</template>
