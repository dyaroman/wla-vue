<script setup lang="ts">
import { useColumnsStore } from '@/stores/columns.store.ts'

const columnsStore = useColumnsStore()
</script>

<template>
  <section class="table">
    <table>
      <thead>
        <tr>
          <th v-for="column in columnsStore.visibleOrdered" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>
    </table>
  </section>
</template>
