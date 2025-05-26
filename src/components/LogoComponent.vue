<script setup lang="ts">
function onClick() {
  document.querySelector('.table')?.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <!--  todo: if data source 'file' add 'logo-fallback' class-->
  <button class="logo" aria-label="scroll table to top" @click="onClick">WL<span>A</span></button>
</template>
