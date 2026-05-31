<script setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  highlight: {
    type: String,
    required: true,
  },
});

// Process the highlight prop: remove '==' prefix
const processedHighlight = computed(() => {
  let h = String(props.highlight);
  if (h.startsWith("==")) {
    h = h.slice(2);
  }
  return h;
});

// Escape special characters for regex
const escapeRegex = (string) => {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

// Create the regex based on the processed highlight string
const regex = computed(() => {
  if (processedHighlight.value === "") {
    return null; // No regex needed if no highlight
  }
  return new RegExp(`(${escapeRegex(processedHighlight.value)})`, "gi");
});

// Split the text into parts based on the regex
const parts = computed(() => {
  if (!regex.value) {
    return [props.text]; // Return original text if no highlight
  }
  return String(props.text).split(regex.value).filter(Boolean); // filter(Boolean) removes empty strings
});

// Check if a part matches the highlight regex
const isHighlight = (part) => {
  return regex.value && regex.value.test(part);
};
</script>

<template>
  <template v-if="processedHighlight === ''">
    {{ text }}
  </template>
  <template v-else v-for="(part, i) in parts" :key="i">
    <mark v-if="isHighlight(part)">{{ part }}</mark>
    <template v-else>{{ part }}</template>
  </template>
</template>
