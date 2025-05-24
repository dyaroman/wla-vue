<script setup lang="ts">
defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="loader" :class="{ 'loader--fixed': fixed }">
    <div class="loader__spinner">
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
</template>
