<script setup>
import { camelCaseToKebabCase } from "@/misc/helpers.js";

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: String,
  checked: Boolean,
});

defineEmits(["change"]);
</script>

<template>
  <label class="checkbox" :data-qa="camelCaseToKebabCase(name)">
    <input
      type="checkbox"
      class="checkbox__input"
      :name
      :checked
      @change="$emit('change')"
    />
    <span class="checkbox__icon" />
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>
