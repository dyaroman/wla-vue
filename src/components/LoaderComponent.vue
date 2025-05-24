<script setup lang="ts">
defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="app-loader" :class="{ 'app-loader--fixed': fixed }">
    <div class="app-loader__spinner">
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
