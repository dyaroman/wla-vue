import { ref } from "vue";
import { defineStore } from "pinia";

import { WEBSITES_DATA_FILENAME } from "@/constants/misc.constants";
import { APP_STATE } from "@/constants/app.constants";
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
  const appState = ref(APP_STATE.LOADING);
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

  const hostEnv = getHostEnv() ?? "demo";
  const primaryUrl = `${__WLA_BACKEND_URL__}/combined?env=${hostEnv}`;

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
    const forceFile = getQueryParamValue("ds") === "file";
    const fallbackUrl = `${__WEBSITES_DATA_URL__}/${WEBSITES_DATA_FILENAME}`;

    // always try the backend first; only fall back to the static file on failure
    if (!forceFile) {
      const data = await _fetchData(primaryUrl, "primary");
      if (data) return data;
      console.warn(
        `Failed to load from backend, falling back to "${WEBSITES_DATA_FILENAME}"`,
      );
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

      appState.value = APP_STATE.SUCCESS;
    } catch (error) {
      console.error("Initialization failed:", error.message || error);
      appState.value = APP_STATE.ERROR;
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
