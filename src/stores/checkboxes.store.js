import { ref } from "vue";
import { defineStore } from "pinia";

export const useCheckboxesStore = defineStore("checkboxes", () => {
  const all = ref(false);
  const values = ref(new Set());

  function toggleAll(state) {
    all.value = state;
    values.value = new Set();
  }

  function toggle(id) {
    if (values.value.has(id)) values.value.delete(id);
    else values.value.add(id);
  }

  return {
    all,
    toggle,
    toggleAll,
    values,
  };
});
