import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import HighlightComponent from "@/components/HighlightComponent.vue";

function marks(wrapper) {
  return wrapper.findAll("mark").map((m) => m.text());
}

describe("HighlightComponent", () => {
  it("renders plain text when there is no highlight", () => {
    const wrapper = mount(HighlightComponent, {
      props: { text: "hello world", highlight: "" },
    });
    expect(wrapper.text()).toBe("hello world");
    expect(wrapper.findAll("mark")).toHaveLength(0);
  });

  it("marks every case-insensitive occurrence (no lastIndex drift)", () => {
    const wrapper = mount(HighlightComponent, {
      props: { text: "aXaXaxa", highlight: "x" },
    });
    // 3 occurrences: X, X, x — the old stateful .test() would miss some
    expect(marks(wrapper)).toEqual(["X", "X", "x"]);
  });

  it("treats the search term literally (escapes regex specials)", () => {
    const wrapper = mount(HighlightComponent, {
      props: { text: "a.b and axb", highlight: "a.b" },
    });
    expect(marks(wrapper)).toEqual(["a.b"]);
  });

  it("strips a leading == operator from the highlight", () => {
    const wrapper = mount(HighlightComponent, {
      props: { text: "status active", highlight: "==active" },
    });
    expect(marks(wrapper)).toEqual(["active"]);
  });
});
