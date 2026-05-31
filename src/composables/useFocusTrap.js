import { watch, nextTick, onScopeDispose } from "vue";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Traps Tab focus within `containerRef` while `isOpen` is true, moves focus
// into the container on open, restores it to the previously focused element on
// close, and forwards Escape to the caller.
//
// Options:
//   onEscape(event) — called on Escape while open; the caller decides whether
//     to preventDefault/close (so persistent overlays can ignore it).
//   onOpened()      — called after focus moves into the container on open.
export function useFocusTrap(containerRef, isOpen, options = {}) {
  let previouslyFocused = null;

  function handleTabKey(event) {
    const container = containerRef.value;
    if (!container) return;

    const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function handleKeyDown(event) {
    if (!isOpen.value) return;

    if (event.key === "Tab") {
      handleTabKey(event);
    } else if (event.key === "Escape") {
      options.onEscape?.(event);
    }
  }

  watch(isOpen, (open) => {
    if (open) {
      previouslyFocused = document.activeElement;
      document.addEventListener("keydown", handleKeyDown);
      nextTick(() => {
        containerRef.value?.focus();
        options.onOpened?.();
      });
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused && "focus" in previouslyFocused) {
        nextTick(() => previouslyFocused.focus());
      }
    }
  });

  onScopeDispose(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });
}
