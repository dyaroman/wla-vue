<script setup>
import CheckboxComponent from '@/components/CheckboxComponent.vue'
import { useColumnsStore } from '@/stores/columns.store.js'

const columnsStore = useColumnsStore()
</script>

<template>
  <section>
    <div class="flex-column">
      <!--      todo: implement @click-->
      <button class="btn">show all</button>
      <button class="btn">hide all</button>
      <button class="btn btn--danger">restore default</button>
      <button class="btn btn--danger">reset sort</button>
    </div>
    <ul class="column-settings">
      <li v-for="column in columnsStore.displayable" :key="column">
        <CheckboxComponent
          :name="column"
          :label="column"
          :checked="columnsStore.getState(column)"
          @change="columnsStore.toggleVisible(column)"
        />
      </li>
    </ul>
  </section>
</template>
