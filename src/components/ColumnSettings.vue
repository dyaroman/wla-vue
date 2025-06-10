<script setup>
import CheckboxComponent from '@/components/CheckboxComponent.vue'
import { useColumnsStore } from '@/stores/columns.store.js'
import { useSortStore } from '@/stores/sort.store.js'
import { camelCaseToTitleCase } from '@/misc/helpers.js'

const columnsStore = useColumnsStore()
const sortStore = useSortStore()
</script>

<template>
  <section>
    <div class="flex-column">
      <button class="btn" @click="columnsStore.visible = new Set(columnsStore.displayable)">
        show all
      </button>
      <button class="btn" @click="columnsStore.visible = new Set()">hide all</button>
      <button
        class="btn btn--danger"
        @click="columnsStore.visible = new Set(columnsStore.defaultVisible)"
        :disabled="
          JSON.stringify(columnsStore.visibleOrdered) ===
          JSON.stringify(columnsStore.defaultVisible)
        "
      >
        restore default
      </button>
      <button class="btn btn--danger" @click="sortStore.reset()" :disabled="sortStore.isPristine">
        reset sort
      </button>
    </div>
    <ul class="column-settings">
      <li v-for="column in columnsStore.displayable" :key="column">
        <CheckboxComponent
          :name="column"
          :label="camelCaseToTitleCase(column)"
          :checked="columnsStore.getState(column)"
          @change="columnsStore.toggleVisible(column)"
        />
      </li>
    </ul>
  </section>
</template>
