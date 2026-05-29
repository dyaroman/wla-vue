<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from "vue";

import ModalComponent from "@/components/ModalComponent.vue";
import AutocompleteInput from "@/components/AutocompleteInput.vue";
import { useModalStore } from "@/stores/modal.store.js";
import { useCommandStore } from "@/stores/command.store.js";
import { MODAL_ID } from "@/constants/modal.constants.js";

const modalStore = useModalStore();
const commandStore = useCommandStore();
const searchQuery = ref("");
const autocompleteRef = ref(null);

const filteredCommands = computed(() => {
  if (!searchQuery.value) return commandStore.commands;
  return commandStore.commands.filter((command) =>
    command.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

function handleGlobalKeydown(event) {
  const isCommandKey = event.metaKey || event.ctrlKey;
  const isK = event.key.toLowerCase() === "k";

  if (isCommandKey && isK) {
    event.preventDefault();
    if (modalStore.openModalId === MODAL_ID.COMMAND_PALETTE) {
      autocompleteRef.value?.focus();
    } else {
      modalStore.openModalId = MODAL_ID.COMMAND_PALETTE;
    }
  }
}

async function handleSelect(command) {
  modalStore.openModalId = null;
  await nextTick();
  commandStore.executeCommand(command.name);
}

function handleAfterOpen() {
  if (autocompleteRef.value) {
    autocompleteRef.value.focus();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<template>
  <ModalComponent
    :id="MODAL_ID.COMMAND_PALETTE"
    @afterOpen="handleAfterOpen"
    position="top"
    :showHeader="false"
  >
    <AutocompleteInput
      ref="autocompleteRef"
      v-model="searchQuery"
      :options="filteredCommands"
      placeholder="Type a command"
      @select="handleSelect"
    />
  </ModalComponent>
</template>

<style scoped></style>
