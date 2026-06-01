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

// Single source of truth for how each column's body cell renders. Entries are
// tried in order and the first whose `match(column)` is true wins, so exact-name
// rules must come before the substring/pattern rules below them. `tdClass`
// (optional) is applied to the wrapping <td>. Adding a column type means adding
// one entry here — no edits to TableComponent. Every cell component takes the
// same `{ item, column }` props so they're interchangeable under <component :is>.
const registry = [
  { match: (column) => column === "index", component: IndexCell },
  { match: (column) => column === "checkbox", component: CheckboxCell },
  { match: (column) => column === "website", component: WebsiteLink },
  { match: (column) => column === "forms", component: FormsCell },
  { match: (column) => column === "pages", component: PagesCell },
  { match: (column) => column === "favicon", component: FaviconCell },
  { match: (column) => column === "ogImage", component: OgImageCell },
  {
    match: (column) => column.includes("Theme"),
    component: ColorCell,
    tdClass: "color-cell",
  },
  { match: (column) => column.includes("Redirect"), component: RedirectCell },
];

const fallback = { component: DefaultCell };

export function resolveCell(column) {
  return registry.find((entry) => entry.match(column)) ?? fallback;
}
