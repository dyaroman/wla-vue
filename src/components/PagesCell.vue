<script setup>
defineProps({
  item: Object,
})
</script>

<template>
  <ul>
    <li v-for="page in item.pages" :key="page">
      <a :href="`https://${item.host}/${page === 'index' ? '' : page}`" target="_blank">{{
        page
      }}</a>
    </li>
  </ul>
</template>
