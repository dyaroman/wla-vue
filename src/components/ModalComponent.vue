<script setup>
import { ref, computed } from "vue";

import { useModalStore } from "@/stores/modal.store";
import { useFocusTrap } from "@/composables/useFocusTrap.js";
import { useBodyScrollLock } from "@/composables/useBodyScrollLock.js";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl", "full"].includes(value),
  },
  maxWidth: {
    type: String,
    default: null,
  },
  maxHeight: {
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
  persistent: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "center",
    validator: (value) => ["center", "top"].includes(value),
  },
});

const emit = defineEmits(["afterOpen"]);

const modalRef = ref(null);

const modalStore = useModalStore();

const isOpen = computed(() => modalStore.openModalId === props.id);

// Handle backdrop click
const handleBackdropClick = () => {
  if (props.closeOnBackdropClick && !props.persistent) {
    modalStore.openModalId = null;
  }
};

useBodyScrollLock(isOpen);
useFocusTrap(modalRef, isOpen, {
  onEscape: (event) => {
    if (props.closeOnEsc && !props.persistent) {
      event.preventDefault();
      event.stopPropagation();
      modalStore.openModalId = null;
    }
  },
  onOpened: () => emit("afterOpen"),
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="backdrop" @click="handleBackdropClick"></div>
    </Transition>
    <Transition name="modal-scale">
      <div v-if="isOpen" class="modal-wrapper" @click="handleBackdropClick">
        <div
          class="modal"
          :class="[
            `modal--${size}`,
            `modal--${position}`,
            { 'modal--persistent': persistent },
          ]"
          :style="{
            maxWidth: maxWidth,
            maxHeight: maxHeight,
          }"
          ref="modalRef"
          tabindex="-1"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          @click.stop
        >
          <div v-if="showHeader" class="modal__header">
            <h3 class="modal__title" id="modal-title">{{ title }}</h3>
            <button
              v-if="!persistent"
              class="modal__close"
              @click="modalStore.openModalId = null"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div class="modal__content">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
