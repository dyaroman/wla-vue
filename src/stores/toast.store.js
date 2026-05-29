import { ref } from "vue";
import { defineStore } from "pinia";

const MAX_ACTIVE = 3;
const DEFAULT_DURATION = 5000;

export const useToastStore = defineStore("toast", () => {
  const active = ref([]);
  const queue = ref([]);

  function _scheduleRemoval(id, duration) {
    setTimeout(() => hide(id), duration);
  }

  function show(message, type = "default", duration = DEFAULT_DURATION) {
    const toast = { id: `${Date.now()}-${Math.random()}`, message, type };

    if (active.value.length < MAX_ACTIVE) {
      active.value.push(toast);
      _scheduleRemoval(toast.id, duration);
    } else {
      queue.value.push({ ...toast, duration });
    }

    return toast.id;
  }

  function hide(id) {
    const index = active.value.findIndex((toast) => toast.id === id);
    if (index === -1) return;

    active.value.splice(index, 1);

    if (queue.value.length > 0 && active.value.length < MAX_ACTIVE) {
      const next = queue.value.shift();
      active.value.push(next);
      _scheduleRemoval(next.id, next.duration ?? DEFAULT_DURATION);
    }
  }

  return {
    active,
    hide,
    queue,
    show,
  };
});
