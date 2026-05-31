import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { useColumnsStore } from "@/stores/columns.store.js";
import { useWebsitesStore } from "@/stores/websites.store.js";
import { usePaginationStore } from "@/stores/pagination.store.js";

function setUrl(search) {
  window.history.replaceState({}, "", `/${search}`);
}

// 120 items => 3 pages at the default perPage of 50.
function seedWebsites() {
  const items = Array.from({ length: 120 }, (_, i) => ({
    website: `site${String(i).padStart(3, "0")}.com`,
  }));
  useWebsitesStore().setInitialItems(items);
}

// setConfig() is what triggers pagination.initializeValues() in the real app,
// and it runs after the websites are seeded (see main.store loadCombinedData).
function configureColumns() {
  useColumnsStore().setConfig({
    website: { renderColumn: true, showColumn: true },
  });
}

describe("pagination.store URL round-trip", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setUrl("");
  });

  it("restores currentPage > 1 from the URL", () => {
    setUrl("?currentPage=2");
    seedWebsites();
    configureColumns();

    const pagination = usePaginationStore();
    expect(pagination.perPage).toBe(50);
    expect(pagination.currentPage).toBe(2);
  });

  it("restores the last page (inclusive bound)", () => {
    setUrl("?currentPage=3");
    seedWebsites();
    configureColumns();

    expect(usePaginationStore().currentPage).toBe(3);
  });

  it("restores a non-default perPage and its page", () => {
    setUrl("?currentPage=4&perPage=25");
    seedWebsites();
    configureColumns();

    const pagination = usePaginationStore();
    expect(pagination.perPage).toBe(25);
    expect(pagination.currentPage).toBe(4);
  });

  it("clamps an out-of-range page back to the default", () => {
    setUrl("?currentPage=99");
    seedWebsites();
    configureColumns();

    expect(usePaginationStore().currentPage).toBe(1);
  });
});
