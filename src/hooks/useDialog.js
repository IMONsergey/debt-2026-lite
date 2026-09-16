import { useEffect, useRef } from 'react';

const dialogs = [];
let previousOverflow;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Keep keyboard focus and scrolling inside the topmost open dialog. */
export function useDialog({ dialogRef, onClose, open = true, initialFocusRef }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return undefined;
    const previouslyFocused = document.activeElement;
    if (!dialogs.length) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    dialogs.push(dialog);
    const focusTarget = window.matchMedia('(pointer: fine)').matches ? initialFocusRef?.current : null;
    (focusTarget ?? dialog).focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (dialogs.at(-1) !== dialog) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll(FOCUSABLE)].filter(element =>
        element.tabIndex >= 0 && element.getClientRects().length && !element.closest('[inert], [aria-hidden="true"]'),
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      const current = document.activeElement;
      if (event.shiftKey && (current === first || current === dialog || !dialog.contains(current))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (current === last || current === dialog || !dialog.contains(current))) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const index = dialogs.indexOf(dialog);
      if (index !== -1) dialogs.splice(index, 1);
      if (!dialogs.length) document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus?.({ preventScroll: true });
    };
  }, [open, dialogRef, initialFocusRef]);
}
