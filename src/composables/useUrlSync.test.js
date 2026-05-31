import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";

import { useUrlSync } from "@/composables/useUrlSync.js";

function firePopState() {
  window.dispatchEvent(new PopStateEvent("popstate"));
}

describe("useUrlSync", () => {
  it("runs a guarded writer when not applying from the URL", () => {
    const { guardWriter } = useUrlSync(() => {});
    const write = vi.fn();

    guardWriter(write)("filters", "value");

    expect(write).toHaveBeenCalledWith("filters", "value");
  });

  it("re-applies URL state on browser Back/Forward", () => {
    const applyFromUrl = vi.fn();
    useUrlSync(applyFromUrl);

    firePopState();

    expect(applyFromUrl).toHaveBeenCalledTimes(1);
  });

  it("suppresses the writer while applying from the URL, then resumes", async () => {
    const write = vi.fn();
    let guardedWrite;
    // applyFromUrl mimics a store re-reading the URL into its state, which would
    // otherwise trip the writer watch and push the value straight back out.
    const { guardWriter } = useUrlSync(() => guardedWrite());
    guardedWrite = guardWriter(write);

    firePopState();
    expect(write).not.toHaveBeenCalled(); // guarded during the apply

    await nextTick();
    guardedWrite();
    expect(write).toHaveBeenCalledTimes(1); // guard lifted afterwards
  });
});
