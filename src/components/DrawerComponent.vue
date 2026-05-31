<script setup>
import { ref, computed } from "vue";

import { useDrawerStore } from "@/stores/drawer.store";
import { useFocusTrap } from "@/composables/useFocusTrap.js";
import { useBodyScrollLock } from "@/composables/useBodyScrollLock.js";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: "right",
    validator: (value) => ["left", "right", "top", "bottom"].includes(value),
  },
  maxSize: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  closeOnBackdropClick: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
});

const drawerRef = ref(null);

const drawerStore = useDrawerStore();

const isOpen = computed(() => drawerStore.openDrawerId === props.id);

useBodyScrollLock(isOpen);
useFocusTrap(drawerRef, isOpen, {
  onEscape: (event) => {
    if (props.closeOnEsc) {
      event.preventDefault();
      event.stopPropagation();
      drawerStore.openDrawerId = null;
    }
  },
});
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="isOpen"
        class="backdrop"
        @click="closeOnBackdropClick && (drawerStore.openDrawerId = null)"
      ></div>
    </Transition>
    <Transition :name="`drawer-slide-${position}`">
      <div
        v-if="isOpen"
        class="drawer"
        :class="`drawer--${position}`"
        :style="{
          maxHeight:
            position === 'top' || position === 'bottom'
              ? (maxSize ?? '50vh')
              : null,
          maxWidth:
            position === 'right' || position === 'left'
              ? (maxSize ?? '50vw')
              : null,
        }"
        ref="drawerRef"
        tabindex="-1"
        role="dialog"
        aria-labelledby="drawer-title"
      >
        <div v-if="showHeader" class="drawer__header">
          <h3 class="drawer__title" id="drawer-title">{{ title }}</h3>
          <button
            class="drawer__close"
            @click="drawerStore.openDrawerId = null"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div class="drawer__content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
