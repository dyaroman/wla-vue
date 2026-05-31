import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { nextTick } from "vue";

import { useColumnsStore } from "@/stores/columns.store.js";
import { getQueryParamValue } from "@/misc/helpers.js";

// website + host are visible by default; campaignId is displayable but hidden.
const config = {
  website: { renderColumn: true, showColumn: true },
  host: { renderColumn: true, showColumn: true },
  campaignId: { renderColumn: true, showColumn: false },
};

// Drive the store's public toggle until exactly `names` are visible.
function setVisible(store, names) {
  store.displayable.forEach((name) => {
    if (store.getState(name) !== names.includes(name))
      store.toggleVisible(name);
  });
}

describe("columns.store visibleColumns URL mapping", () => {
  let store;

  beforeEach(async () => {
    window.history.replaceState({}, "", "/");
    setActivePinia(createPinia());
    store = useColumnsStore();
    store.setConfig(config);
    await nextTick();
  });

  it("writes no param for the default set", () => {
    expect(getQueryParamValue("visibleColumns")).toBeUndefined();
  });

  it("writes 'all' when every displayable column is visible", async () => {
    setVisible(store, ["website", "host", "campaignId"]);
    await nextTick();
    expect(getQueryParamValue("visibleColumns")).toBe("all");
  });

  it("writes 'none' when no column is visible", async () => {
    setVisible(store, []);
    await nextTick();
    expect(getQueryParamValue("visibleColumns")).toBe("none");
  });

  it("writes a comma list for a custom set", async () => {
    setVisible(store, ["host"]);
    await nextTick();
    expect(getQueryParamValue("visibleColumns")).toBe("host");
  });
});
