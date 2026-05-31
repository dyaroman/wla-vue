import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { nextTick } from "vue";

import { useCheckboxesStore } from "@/stores/checkboxes.store.js";

const STORAGE_KEY = "wla:reviewed";

describe("checkboxes.store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("tracks selection by stable id", () => {
    const store = useCheckboxesStore();
    store.toggle("a.com");
    expect(store.isChecked("a.com")).toBe(true);
    expect(store.isChecked("b.com")).toBe(false);

    store.toggle("a.com");
    expect(store.isChecked("a.com")).toBe(false);
  });

  it("select-all seeds the set, leaving rows individually deselectable", () => {
    const store = useCheckboxesStore();
    const ids = ["a.com", "b.com", "c.com"];

    store.setMany(ids, true);
    expect(ids.every((id) => store.isChecked(id))).toBe(true);

    // an individual row can still be turned off while "all" is on
    store.toggle("b.com");
    expect(store.isChecked("b.com")).toBe(false);
    expect(store.isChecked("a.com")).toBe(true);

    store.setMany(ids, false);
    expect(ids.some((id) => store.isChecked(id))).toBe(false);
  });

  it("persists selection to localStorage", async () => {
    const store = useCheckboxesStore();
    store.toggle("a.com");
    await nextTick();

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(["a.com"]);
  });

  it("rehydrates selection from localStorage on creation", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["x.com", "y.com"]));
    setActivePinia(createPinia());

    const store = useCheckboxesStore();
    expect(store.isChecked("x.com")).toBe(true);
    expect(store.isChecked("y.com")).toBe(true);
  });

  it("tolerates corrupt localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "not json");
    setActivePinia(createPinia());

    const store = useCheckboxesStore();
    expect(store.values.size).toBe(0);
  });
});
