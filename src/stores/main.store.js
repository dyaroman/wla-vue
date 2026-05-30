import { ref } from "vue";
import { defineStore } from "pinia";

import { WEBSITES_DATA_FILENAME } from "@/constants/misc.constants";
import { useWebsitesStore } from "@/stores/websites.store";
import { useColumnsStore } from "@/stores/columns.store";
import { useToastStore } from "@/stores/toast.store";
import { getQueryParamValue } from "@/misc/helpers";

// after this long hidden, re-check the backend for fresher data on focus
const FRESH_DATA_INACTIVITY_MS = 10 * 60_000;
const RELOAD_DELAY_MS = 5_000;

export const useMainStore = defineStore("main", () => {
  const websitesStore = useWebsitesStore();
  const columnsStore = useColumnsStore();
  const toastStore = useToastStore();
  const appState = ref("loading");
  const env = ref("");
  const commit = ref("");
  const timestamp = ref("");
  const dataSource = ref("");
  const websitesDataETag = ref(null);

  const getHostEnv = () => {
    const subdomain = window.location.hostname.split(".")[0];
    if (["localhost", "rc", "dev", "prod"].includes(subdomain)) {
      return subdomain === "prod" ? "prod" : "dev";
    }
    return null;
  };

  const hostEnv = getHostEnv();
  const primaryUrl = `${import.meta.env.VITE_WLA_BACKEND_URL}/combined?env=${hostEnv}`;

  async function _fetchData(url, sourceName, isFallback = false) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        dataSource.value = sourceName;
        if (sourceName === "primary") {
          websitesDataETag.value = response.headers.get("ETag");
        }
        return await response.json();
      }

      const logFn = isFallback ? console.error : console.warn;
      logFn(`${sourceName} endpoint failed:`, response.status);
    } catch (error) {
      console.error(`${sourceName} fetch error:`, error);
    }
    return null;
  }

  async function _loadData() {
    const isOverrideSet = getQueryParamValue("ds") === "file";
    const useFallbackFirst = isOverrideSet || !hostEnv;

    const fallbackUrl = `${import.meta.env.VITE_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`;

    if (!useFallbackFirst) {
      const data = await _fetchData(primaryUrl, "primary");
      if (data) return data;
    } else {
      const reason = isOverrideSet ? "query param override" : "missing hostEnv";
      console.warn("Using fallback due to", reason);
    }

    return await _fetchData(fallbackUrl, "fallback", true);
  }

  async function loadCombinedData() {
    try {
      const data = await _loadData();

      if (!data) {
        throw new Error("Failed to load combined data from all sources");
      }

      const { websites, columns, ...misc } = data;

      if (websites) websitesStore.setInitialItems(websites);
      if (columns) {
        const columnsConfig = Array.isArray(columns)
          ? columns.reduce((acc, col) => {
              const { name, ...rest } = col;
              acc[name] = rest;
              return acc;
            }, {})
          : columns;
        columnsStore.setConfig(columnsConfig);
      }

      if (misc) {
        env.value = misc.env ?? hostEnv;
        commit.value = misc.commit ?? "";
        timestamp.value = misc.timestamp ?? "";
      }

      appState.value = "success";
    } catch (error) {
      console.error("Initialization failed:", error.message || error);
      appState.value = "error";
    }
  }

  // HEAD the backend and compare ETags; if data changed, warn and reload
  async function checkForUpdates() {
    // only meaningful when we actually loaded from the DB and captured an ETag
    if (dataSource.value !== "primary" || !websitesDataETag.value) return;

    try {
      const response = await fetch(primaryUrl, { method: "HEAD" });
      const newETag = response.headers.get("ETag");
      if (newETag && newETag !== websitesDataETag.value) {
        toastStore.show(
          "New data is available. The page will be reloaded in 5 seconds.",
          "default",
          RELOAD_DELAY_MS,
        );
        setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
      }
    } catch (error) {
      console.error("Fresh-data check failed:", error);
    }
  }

  return {
    appState,
    checkForUpdates,
    commit,
    dataSource,
    env,
    inactivityThreshold: FRESH_DATA_INACTIVITY_MS,
    loadCombinedData,
    timestamp,
  };
});
