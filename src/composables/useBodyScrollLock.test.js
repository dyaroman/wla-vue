import { describe, it, expect, afterEach, vi } from "vitest";
import { effectScope, ref, nextTick } from "vue";

import { useBodyScrollLock } from "@/composables/useBodyScrollLock.js";

// jsdom does not implement window.scrollTo
window.scrollTo = vi.fn();

const scopes = [];

function mountLock(isOpen) {
  const scope = effectScope();
  scope.run(() => useBodyScrollLock(isOpen));
  scopes.push(scope);
  return scope;
}

afterEach(() => {
  // dispose every scope so the shared lock counter resets between tests
  while (scopes.length) scopes.pop().stop();
});

describe("useBodyScrollLock", () => {
  it("locks and unlocks body scroll with a single overlay", async () => {
    const open = ref(false);
    mountLock(open);

    open.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    open.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("");
  });

  it("stays locked until the last overlay closes (shared counter)", async () => {
    const drawer = ref(false);
    const modal = ref(false);
    mountLock(drawer);
    mountLock(modal);

    drawer.value = true;
    await nextTick();
    modal.value = true; // modal opened on top of the drawer
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    drawer.value = false; // first overlay closes, modal still open
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    modal.value = false; // last overlay closes
    await nextTick();
    expect(document.body.style.overflow).toBe("");
  });

  it("releases the lock when an open overlay is unmounted", async () => {
    const open = ref(true);
    const scope = mountLock(open);
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    scope.stop();
    expect(document.body.style.overflow).toBe("");
  });
});
