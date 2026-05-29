<script setup>
import { useToastStore } from "@/stores/toast.store.js";

const toastStore = useToastStore();
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      name="toast"
      class="toast-container"
      data-qa="toast-container"
    >
      <div
        v-for="toast in toastStore.active"
        :key="toast.id"
        class="toast"
        :class="toast.type !== 'default' ? `toast--${toast.type}` : null"
        role="status"
        data-qa="toast"
        @click="toastStore.hide(toast.id)"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>
