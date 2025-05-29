<script setup>
defineProps({
  name: String,
  label: String,
  checked: Boolean,
})

defineEmits(['change'])
</script>

<template>
  <label class="checkbox" :data-qa="name">
    <input type="checkbox" class="checkbox__input" :name :checked @change="$emit('change')" />
    <span class="checkbox__icon" />
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>
