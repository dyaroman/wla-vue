<script setup lang="ts">
import { useColumnsStore } from '@/stores/columns.store.ts'
import { useWebsitesStore } from '@/stores/websites.store.ts'

const columnsStore = useColumnsStore()
const websitesStore = useWebsitesStore()
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

      <tbody>
        <tr v-for="item in websitesStore.items" :key="item.website">
          <td v-for="column in columnsStore.visibleOrdered" :key="column">
            {{ item[column] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
