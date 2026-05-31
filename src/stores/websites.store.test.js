import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { useWebsitesStore } from "@/stores/websites.store.js";
import { useFiltersStore } from "@/stores/filters.store.js";

const items = [
  { website: "a.com", pages: ["login", "about-us"], tags: [] },
  { website: "b.com", pages: ["contact", "index"], tags: [] },
  { website: "c.com", pages: ["login", "rates-and-fees"], tags: [] },
];

function visibleWebsites() {
  return useWebsitesStore()
    .visibleItems.map((w) => w.website)
    .sort();
}

describe("websites.store pages filter", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useWebsitesStore().setInitialItems(items);
  });

  it("keeps only rows that have a page matching the search", () => {
    useFiltersStore().values.pages = "login";
    expect(visibleWebsites()).toEqual(["a.com", "c.com"]);
  });

  it("supports exact match with ==", () => {
    useFiltersStore().values.pages = "==contact";
    expect(visibleWebsites()).toEqual(["b.com"]);
  });

  it("is a no-op when the pages filter is empty", () => {
    useFiltersStore().values.pages = "";
    expect(visibleWebsites()).toEqual(["a.com", "b.com", "c.com"]);
  });
});
