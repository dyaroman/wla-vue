import { ref, watch } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "wla:reviewed";

// "Reviewed" marks are keyed by a stable website identifier (item.website),
// not by list position, so they stay attached to the right row across
// sort/filter/tag changes, and persist across reloads.
function loadPersisted() {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export const useCheckboxesStore = defineStore("checkboxes", () => {
  const values = ref(loadPersisted());

  function isChecked(id) {
    return values.value.has(id);
  }

  function toggle(id) {
    if (values.value.has(id)) values.value.delete(id);
    else values.value.add(id);
  }

  // Seed (or clear) the set for a known list of ids — used by "select all".
  function setMany(ids, checked) {
    ids.forEach((id) => {
      if (checked) values.value.add(id);
      else values.value.delete(id);
    });
  }

  function clear() {
    values.value = new Set();
  }

  watch(
    values,
    (set) => {
      if (typeof localStorage === "undefined") return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
      } catch {
        // storage unavailable or over quota — keep working in-memory
      }
    },
    { deep: true },
  );

  return {
    values,
    isChecked,
    toggle,
    setMany,
    clear,
  };
});
