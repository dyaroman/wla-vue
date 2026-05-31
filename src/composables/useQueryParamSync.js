// Centralized query-param sync: one URL writer and one app-lifetime popstate
// listener, shared by the columns/filters/sort/tags/pagination stores.
//
// This replaces the "build params -> replaceState" block plus the per-store
// popstate listener that was copy-pasted in five stores — the root cause of:
//   - blanket `decodeURIComponent(params.toString())` also
//     un-escaped %26 (&) and %23 (#), corrupting values like "Smith & Co".
//   - each store added a popstate listener but tore it down from
//     TableComponent.onUnmounted, so Back/Forward stopped restoring state
//     once the table was hidden and never recovered.

const popstateHandlers = new Set();
let popstateBound = false;

// Encode params correctly but keep commas readable. Only %2C is decoded back
// to ",", so values containing & or # stay percent-encoded (and intact).
function toPrettyQuery(params) {
  return params.toString().replace(/%2C/gi, ",");
}

// Apply a set of {key: value} updates to the current query string and write it
// back with history.replaceState. A null/undefined/"" value removes the key.
export function replaceQueryParams(updates) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "")
      params.delete(key);
    else params.set(key, String(value));
  }

  const query = toPrettyQuery(params);
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;

  window.history.replaceState(null, "", url);
}

// Register a handler for browser Back/Forward. A single popstate listener fans
// out to all handlers and is never torn down for the app's lifetime.
export function onPopState(handler) {
  if (typeof window === "undefined") return;

  popstateHandlers.add(handler);

  if (!popstateBound) {
    window.addEventListener("popstate", () => {
      popstateHandlers.forEach((h) => h());
    });
    popstateBound = true;
  }
}
