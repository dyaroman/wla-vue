import { watch, onScopeDispose } from "vue";

// Locks body scroll while an overlay is open, preserving scroll position.
//
// A module-level counter lets concurrent overlays (e.g. the command palette
// modal opened on top of a drawer) share one lock: the scroll position is
// saved when the first lock engages and restored only when the last releases,
// so they no longer clobber each other's saved position.
let lockCount = 0;
let savedScrollY = 0;

function engageLock() {
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
  }
  lockCount += 1;
}

function releaseLock() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }
}

export function useBodyScrollLock(isOpen) {
  // Track this instance's contribution so it adds at most one to the counter
  // and always releases on close/unmount.
  let locked = false;

  function setLocked(next) {
    if (next && !locked) {
      engageLock();
      locked = true;
    } else if (!next && locked) {
      releaseLock();
      locked = false;
    }
  }

  watch(isOpen, (open) => setLocked(open), { immediate: true });

  onScopeDispose(() => setLocked(false));
}
