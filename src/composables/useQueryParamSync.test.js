import { describe, it, expect, beforeEach } from "vitest";

import { replaceQueryParams } from "@/composables/useQueryParamSync.js";
import { getQueryParamValue } from "@/misc/helpers.js";

function setUrl(search) {
  window.history.replaceState({}, "", `/${search}`);
}

describe("replaceQueryParams encoding", () => {
  beforeEach(() => setUrl(""));

  it("keeps values containing & intact (round-trip)", () => {
    replaceQueryParams({ companyName: "Smith & Co" });

    // & must stay percent-encoded so it does not split into two params
    expect(window.location.search).toContain("%26");
    expect(window.location.search).not.toMatch(/companyName=Smith & Co/);
    expect(getQueryParamValue("companyName")).toBe("Smith & Co");
  });

  it("keeps values containing # intact (no fragment truncation)", () => {
    replaceQueryParams({ owner: "a#b" });

    expect(window.location.hash).toBe("");
    expect(getQueryParamValue("owner")).toBe("a#b");
  });

  it("renders commas prettily but reads them back", () => {
    replaceQueryParams({ tags: "alpha,beta,gamma" });

    expect(window.location.search).toBe("?tags=alpha,beta,gamma");
    expect(getQueryParamValue("tags")).toBe("alpha,beta,gamma");
  });

  it("removes a key for null/empty values", () => {
    replaceQueryParams({ sort: "website" });
    expect(getQueryParamValue("sort")).toBe("website");

    replaceQueryParams({ sort: null });
    expect(getQueryParamValue("sort")).toBeUndefined();
    expect(window.location.search).toBe("");
  });

  it("merges with existing params instead of clobbering them", () => {
    replaceQueryParams({ sort: "website" });
    replaceQueryParams({ order: "desc" });

    expect(getQueryParamValue("sort")).toBe("website");
    expect(getQueryParamValue("order")).toBe("desc");
  });

  it("reads keys case-sensitively", () => {
    replaceQueryParams({ currentPage: "3" });

    expect(getQueryParamValue("currentPage")).toBe("3");
    expect(getQueryParamValue("currentpage")).toBeUndefined();
  });
});
