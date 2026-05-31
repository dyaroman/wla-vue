import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import AutocompleteInput from "@/components/AutocompleteInput.vue";

// jsdom has no scrollIntoView; the active-option watcher calls it on arrow nav.
Element.prototype.scrollIntoView = () => {};

function activeIndexOf(wrapper) {
  return wrapper
    .findAll(".autocomplete__item")
    .findIndex((li) => li.classes("active"));
}

describe("AutocompleteInput", () => {
  it("keeps selectedIndex a valid number when arrowing over zero options", async () => {
    // % 0 used to make selectedIndex NaN (e.g. a non-matching palette query).
    const wrapper = mount(AutocompleteInput, {
      props: { options: [], modelValue: "no match" },
    });
    const input = wrapper.find("input");

    await input.trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.vm.selectedIndex).toBe(0);

    await input.trigger("keydown", { key: "ArrowUp" });
    expect(wrapper.vm.selectedIndex).toBe(0);
  });

  it("moves and wraps the active option with ArrowDown", async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        options: [{ name: "a" }, { name: "b" }, { name: "c" }],
        modelValue: "",
      },
    });
    const input = wrapper.find("input");

    expect(activeIndexOf(wrapper)).toBe(0);

    await input.trigger("keydown", { key: "ArrowDown" });
    expect(activeIndexOf(wrapper)).toBe(1);

    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(activeIndexOf(wrapper)).toBe(0); // 2 -> wrapped back to 0
  });
});
