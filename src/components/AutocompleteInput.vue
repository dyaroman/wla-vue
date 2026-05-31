<script setup>
import { ref, watch, nextTick, useTemplateRef } from "vue";

import HighlightComponent from "@/components/HighlightComponent.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Type to search...",
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

const selectedIndex = ref(0);
const inputRef = ref(null);
const optionRefs = useTemplateRef("optionItems");

watch(
  () => props.options,
  () => {
    selectedIndex.value = 0;
  },
);

watch(selectedIndex, async (newIndex) => {
  await nextTick();
  const activeElement = optionRefs.value?.[newIndex];
  if (activeElement) {
    activeElement.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }
});

function handleKeydown(event) {
  if (event.key === "Enter") {
    const selected = props.options[selectedIndex.value];
    if (selected) {
      emit("select", selected);
    }
  } else if (event.key === "ArrowDown") {
    if (props.options.length === 0) return;
    event.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % props.options.length;
  } else if (event.key === "ArrowUp") {
    if (props.options.length === 0) return;
    event.preventDefault();
    selectedIndex.value =
      (selectedIndex.value - 1 + props.options.length) % props.options.length;
  } else if (event.key === "Escape") {
    if (props.modelValue) {
      emit("update:modelValue", "");
    }
  }
}

function handleInput(event) {
  emit("update:modelValue", event.target.value);
}

function focus() {
  inputRef.value?.focus();
}

defineExpose({ focus });
</script>

<template>
  <div class="autocomplete">
    <div class="autocomplete__input-wrapper">
      <input
        ref="inputRef"
        type="text"
        class="input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </div>
    <ul v-if="options.length" class="autocomplete__list">
      <li
        v-for="(option, index) in options"
        :key="option.name || option.id || index"
        ref="optionItems"
        class="autocomplete__item"
        :class="{ active: index === selectedIndex }"
        @mouseenter="selectedIndex = index"
        @click="emit('select', option)"
      >
        <slot name="option" :option :index>
          <HighlightComponent
            :text="option.name || option"
            :highlight="modelValue"
          />
        </slot>
      </li>
    </ul>
    <div v-else-if="modelValue" class="autocomplete__empty">
      <slot name="empty">No results found.</slot>
    </div>
  </div>
</template>
