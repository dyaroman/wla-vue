<script setup>
import { CHECKBOX_STATES } from '@/constants/checkbox.constants'
import { useTagsStore } from '@/stores/tags.store'
import { computed } from 'vue'
import { camelCaseToKebabCase } from '@/misc/helpers.js'

const { name } = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const tagsStore = useTagsStore()

const disabled = computed(
  () =>
    !tagsStore.available.includes(name) &&
    tagsStore.getState(name) !== CHECKBOX_STATES.INCLUDE &&
    tagsStore.getState(name) !== CHECKBOX_STATES.EXCLUDE,
)
</script>

<template>
  <label
    class="three-state-checkbox"
    :class="[`three-state-checkbox--${tagsStore.getState(name)}`, { disabled }]"
    :data-qa="camelCaseToKebabCase(name).replace('(f) ', '').replaceAll(' ', '-')"
  >
    <input
      type="checkbox"
      class="three-state-checkbox__input"
      @click="tagsStore.toggleState(name)"
      :checked="tagsStore.getState(name) !== CHECKBOX_STATES.IGNORE"
      :name
      :tabindex="disabled ? -1 : null"
    />
    <span class="three-state-checkbox__icon" />
    <span class="three-state-checkbox__label">{{ name }}</span>
  </label>
</template>
