import { ref, nextTick } from "vue";

import { onPopState } from "@/composables/useQueryParamSync.js";

// Owns the "applying URL -> state" guard shared by every URL-synced store
// (columns/filters/pagination/sort/tags).
//
// Browser Back/Forward fires popstate; we then re-read the query string into
// store state via `applyFromUrl`. While that runs the store's writer watch must
// NOT push those same values straight back into the URL, so a flag is raised
// for the duration and cleared on the next tick (after watchers have flushed).
//
// `guardWriter` wraps a writer (a watch callback) so it no-ops while the flag is
// up, replacing the per-store ceremony each store used to copy-paste:
//   const { guardWriter } = useUrlSync(initializeValues);
//   watch(source, guardWriter((value) => replaceQueryParams({ ... })));
export function useUrlSync(applyFromUrl) {
  const isUpdatingFromUrl = ref(false);

  onPopState(() => {
    isUpdatingFromUrl.value = true;
    applyFromUrl();
    nextTick(() => {
      isUpdatingFromUrl.value = false;
    });
  });

  const guardWriter =
    (write) =>
    (...args) => {
      if (isUpdatingFromUrl.value) return;
      write(...args);
    };

  return { guardWriter };
}
