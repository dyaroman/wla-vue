import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { useColumnsStore } from "@/stores/columns.store.js";
import { useSortStore } from "@/stores/sort.store.js";

function setUrl(search) {
  window.history.replaceState({}, "", `/${search}`);
}

// Give the columns store a config so `sortable` is populated. setConfig also
// kicks off the other stores' initializeValues(), which reads the URL.
function configureColumns() {
  const columnsStore = useColumnsStore();
  columnsStore.setConfig({
    website: { renderColumn: true, showColumn: true },
    campaignId: { renderColumn: true, showColumn: true },
  });
  return columnsStore;
}

describe("sort.store URL round-trip", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setUrl("");
  });

  it("restores a camelCase sort column from the URL", () => {
    setUrl("?sort=campaignId&order=desc");
    configureColumns();

    const sortStore = useSortStore();
    expect(sortStore.sort).toBe("campaignId");
    expect(sortStore.order).toBe("desc");
  });

  it("restores an all-lowercase sort column from the URL", () => {
    setUrl("?sort=website");
    configureColumns();

    const sortStore = useSortStore();
    expect(sortStore.sort).toBe("website");
    expect(sortStore.order).toBe("asc");
  });

  it("falls back to defaults for an unknown sort column", () => {
    setUrl("?sort=doesNotExist");
    configureColumns();

    const sortStore = useSortStore();
    expect(sortStore.sort).toBe("website");
    expect(sortStore.order).toBe("asc");
  });
});
