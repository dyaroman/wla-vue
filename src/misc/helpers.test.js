import { describe, it, expect } from "vitest";

import {
  search,
  sort,
  getContrastColor,
  camelCaseToTitleCase,
  camelCaseToKebabCase,
  getUniqueValues,
  getUniqueTags,
} from "@/misc/helpers.js";
import { NO_DATA } from "@/constants/misc.constants.js";

describe("search", () => {
  it("matches a case-insensitive substring", () => {
    expect(search("Hello World", "world")).toBe(true);
    expect(search("Hello World", "xyz")).toBe(false);
  });

  it("supports == for exact equality", () => {
    expect(search("active", "==active")).toBe(true);
    expect(search("inactive", "==active")).toBe(false);
  });

  it("supports != for inequality", () => {
    expect(search("active", "!=active")).toBe(false);
    expect(search("inactive", "!=active")).toBe(true);
  });

  it("coerces non-string inputs", () => {
    expect(search(123, "12")).toBe(true);
    expect(search(true, "==true")).toBe(true);
  });
});

describe("sort", () => {
  it("sorts strings case-insensitively", () => {
    const input = [{ name: "banana" }, { name: "Apple" }, { name: "cherry" }];
    const result = sort(input, "name").map((i) => i.name);
    expect(result).toEqual(["Apple", "banana", "cherry"]);
  });

  it("sorts campaignId numerically, not lexicographically", () => {
    const input = [
      { campaignId: "100" },
      { campaignId: "9" },
      { campaignId: "20" },
    ];
    const result = sort(input, "campaignId").map((i) => i.campaignId);
    expect(result).toEqual(["9", "20", "100"]);
  });

  it("sorts date columns chronologically", () => {
    const input = [
      { effectiveDate: "2024-03-01" },
      { effectiveDate: "2024-01-01" },
      { effectiveDate: "2024-02-01" },
    ];
    const result = sort(input, "effectiveDate").map((i) => i.effectiveDate);
    expect(result).toEqual(["2024-01-01", "2024-02-01", "2024-03-01"]);
  });

  it("pushes NO_DATA rows to the end regardless of order", () => {
    const input = [{ name: "beta" }, { name: NO_DATA }, { name: "alpha" }];
    const result = sort(input, "name").map((i) => i.name);
    expect(result).toEqual(["alpha", "beta", NO_DATA]);
  });

  it("does not mutate the input array", () => {
    const input = [{ name: "b" }, { name: "a" }];
    const copy = [...input];
    sort(input, "name");
    expect(input).toEqual(copy);
  });

  it("is stable for equal keys (comparator returns 0)", () => {
    const input = [
      { name: "same", id: 1 },
      { name: "same", id: 2 },
      { name: "same", id: 3 },
    ];
    const result = sort(input, "name").map((i) => i.id);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe("getContrastColor", () => {
  it("returns white text on a dark background", () => {
    expect(getContrastColor("#000000")).toBe("#fff");
    expect(getContrastColor("#0B74D1")).toBe("#fff");
  });

  it("returns black text on a light background", () => {
    expect(getContrastColor("#ffffff")).toBe("#000");
    expect(getContrastColor("#fbe8a6")).toBe("#000");
  });

  it("handles shorthand hex", () => {
    expect(getContrastColor("#000")).toBe("#fff");
    expect(getContrastColor("#fff")).toBe("#000");
  });
});

describe("camelCaseToTitleCase", () => {
  it("splits camelCase and capitalizes", () => {
    expect(camelCaseToTitleCase("campaignId")).toBe("Campaign Id");
    expect(camelCaseToTitleCase("lastModifiedTermsOfUse")).toBe(
      "Last Modified Terms Of Use",
    );
  });

  it("capitalizes a single word", () => {
    expect(camelCaseToTitleCase("website")).toBe("Website");
  });

  it("returns an empty string for non-strings or empty input", () => {
    expect(camelCaseToTitleCase("")).toBe("");
    expect(camelCaseToTitleCase(null)).toBe("");
    expect(camelCaseToTitleCase(42)).toBe("");
  });
});

describe("camelCaseToKebabCase", () => {
  it("converts camelCase to kebab-case", () => {
    expect(camelCaseToKebabCase("campaignId")).toBe("campaign-id");
    expect(camelCaseToKebabCase("companyName")).toBe("company-name");
  });

  it("leaves a single lowercase word unchanged", () => {
    expect(camelCaseToKebabCase("website")).toBe("website");
  });

  it("returns an empty string for nullish input", () => {
    expect(camelCaseToKebabCase(undefined)).toBe("");
    expect(camelCaseToKebabCase(null)).toBe("");
  });
});

describe("getUniqueTags", () => {
  it("returns sorted unique tags across websites", () => {
    const websites = [{ tags: ["b", "a"] }, { tags: ["a", "c"] }];
    expect(getUniqueTags(websites)).toEqual(["a", "b", "c"]);
  });

  it("does not throw when a website has no tags", () => {
    const websites = [{ tags: ["a"] }, { website: "no-tags.com" }, {}];
    expect(() => getUniqueTags(websites)).not.toThrow();
    expect(getUniqueTags(websites)).toEqual(["a"]);
  });

  it("returns an empty array for nullish input", () => {
    expect(getUniqueTags(null)).toEqual([]);
    expect(getUniqueTags(undefined)).toEqual([]);
  });
});

describe("getUniqueValues", () => {
  it("collects unique scalar property values", () => {
    const arr = [{ env: "demo" }, { env: "prod" }, { env: "demo" }];
    expect(getUniqueValues(arr, "env").sort()).toEqual(["demo", "prod"]);
  });

  it("flattens array-valued properties", () => {
    const arr = [{ tags: ["a", "b"] }, { tags: ["b", "c"] }];
    expect(getUniqueValues(arr, "tags").sort()).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for invalid input", () => {
    expect(getUniqueValues(null, "x")).toEqual([]);
    expect(getUniqueValues([], "x")).toEqual([]);
    expect(getUniqueValues([{ a: 1 }], "")).toEqual([]);
  });
});
