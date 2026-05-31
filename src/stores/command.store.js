import { defineStore } from "pinia";
import { ref } from "vue";

import { useWebsitesStore } from "@/stores/websites.store.js";
import { useToastStore } from "@/stores/toast.store.js";
import { useFiltersStore } from "@/stores/filters.store.js";
import { useTagsStore } from "@/stores/tags.store.js";
import { useSortStore } from "@/stores/sort.store.js";
import { useDrawerStore } from "@/stores/drawer.store.js";
import { useModalStore } from "@/stores/modal.store.js";
import { DRAWER_ID } from "@/constants/drawers.constants.js";
import { MODAL_ID } from "@/constants/modal.constants.js";

export const useCommandStore = defineStore("command", () => {
  const websitesStore = useWebsitesStore();
  const toastStore = useToastStore();
  const filtersStore = useFiltersStore();
  const tagsStore = useTagsStore();
  const sortStore = useSortStore();
  const drawerStore = useDrawerStore();
  const modalStore = useModalStore();

  async function _copyToClipboard(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      toastStore.show(successMessage, "success");
    } catch (error) {
      console.warn("Clipboard write failed:", error);
      toastStore.show("Failed to copy to clipboard", "error");
    }
  }

  const commands = ref([
    {
      name: "copy websites domains list",
      action: () => {
        const domains = websitesStore.visibleItems.map((w) => w.website);
        _copyToClipboard(
          domains.join("\n"),
          `Copied ${domains.length} domains`,
        );
      },
    },
    {
      name: "copy websites domains comma separated list",
      action: () => {
        const domains = websitesStore.visibleItems.map((w) => w.website);
        _copyToClipboard(domains.join(), `Copied ${domains.length} domains`);
      },
    },
    {
      name: "copy websites urls list",
      action: () => {
        const urls = websitesStore.visibleItems.map((w) => `https://${w.host}`);
        _copyToClipboard(urls.join("\n"), `Copied ${urls.length} urls`);
      },
    },
    {
      name: "reset filters",
      action: () => {
        filtersStore.resetAll();
        toastStore.show("Filters reset", "success");
      },
    },
    {
      name: "reset tags",
      action: () => {
        tagsStore.resetAll();
        toastStore.show("Tags reset", "success");
      },
    },
    {
      name: "reset sort",
      action: () => {
        sortStore.reset();
        toastStore.show("Sort reset", "success");
      },
    },
    {
      name: "reset all",
      action: () => {
        filtersStore.resetAll();
        tagsStore.resetAll();
        sortStore.reset();
        toastStore.show("Filters, tags and sort reset", "success");
      },
    },
    {
      name: "open filters",
      action: () => {
        drawerStore.openDrawerId = DRAWER_ID.FILTERS;
      },
    },
    {
      name: "open tags",
      action: () => {
        drawerStore.openDrawerId = DRAWER_ID.TAGS;
      },
    },
    {
      name: "open columns settings",
      action: () => {
        drawerStore.openDrawerId = DRAWER_ID.CUSTOMIZE_COLUMNS;
      },
    },
    {
      name: "open app info",
      action: () => {
        drawerStore.openDrawerId = DRAWER_ID.SIDEBAR;
      },
    },
    {
      name: "help",
      action: () => {
        modalStore.openModalId = MODAL_ID.HOW_TO;
      },
    },
  ]);

  function executeCommand(commandName) {
    const command = commands.value.find((cmd) => cmd.name === commandName);
    if (command) {
      command.action();
    } else {
      console.warn(`Command not found: ${commandName}`);
      toastStore.show(`Command not found: ${commandName}`, "error");
    }
  }

  return {
    commands,
    executeCommand,
  };
});
