<script setup>
defineProps({
  item: Object,
})
</script>

<template>
  <a :href="`https://${item.host}`" target="_blank">{{ item.website }}</a>
</template>
