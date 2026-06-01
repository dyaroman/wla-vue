import { describe, it, expect } from "vitest";

import { resolveCell } from "@/components/cellRegistry.js";
import IndexCell from "@/components/IndexCell.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import WebsiteLink from "@/components/WebsiteLink.vue";
import FormsCell from "@/components/FormsCell.vue";
import PagesCell from "@/components/PagesCell.vue";
import ColorCell from "@/components/ColorCell.vue";
import RedirectCell from "@/components/RedirectCell.vue";
import FaviconCell from "@/components/FaviconCell.vue";
import OgImageCell from "@/components/OgImageCell.vue";
import DefaultCell from "@/components/DefaultCell.vue";

describe("resolveCell", () => {
  it("maps exact column names to their cell component", () => {
    expect(resolveCell("index").component).toBe(IndexCell);
    expect(resolveCell("checkbox").component).toBe(CheckboxCell);
    expect(resolveCell("website").component).toBe(WebsiteLink);
    expect(resolveCell("forms").component).toBe(FormsCell);
    expect(resolveCell("pages").component).toBe(PagesCell);
    expect(resolveCell("favicon").component).toBe(FaviconCell);
    expect(resolveCell("ogImage").component).toBe(OgImageCell);
  });

  it("matches color (*Theme) and redirect (*Redirect) columns by pattern", () => {
    expect(resolveCell("headerTheme").component).toBe(ColorCell);
    expect(resolveCell("footerTheme").component).toBe(ColorCell);
    expect(resolveCell("rootRedirect").component).toBe(RedirectCell);
    expect(resolveCell("ocsDefaultRedirect").component).toBe(RedirectCell);
  });

  it("tags color columns with the color-cell td class", () => {
    expect(resolveCell("headerTheme").tdClass).toBe("color-cell");
    expect(resolveCell("website").tdClass).toBeUndefined();
  });

  it("falls back to DefaultCell for unknown columns", () => {
    expect(resolveCell("campaignId").component).toBe(DefaultCell);
    expect(resolveCell("effectiveDate").component).toBe(DefaultCell);
  });
});
