import { useEffect } from 'react';

/** Focus containment, Escape, scroll lock, and exact return focus for custom dialogs. */
export function useDialog(ref, onClose) {
  useEffect(() => {
    const opener = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = ref.current;
    const focusables = () => [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([type="hidden"]):not([tabindex="-1"]),textarea,[tabindex="0"]')].filter((x) => x.getClientRects().length);
    (focusables()[0] || dialog)?.focus({ preventScroll: true });

    function key(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const list = focusables();
        const first = list[0];
        const last = list.at(-1);
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, onClose]);
}
