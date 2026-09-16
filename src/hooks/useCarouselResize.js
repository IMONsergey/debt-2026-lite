import { useEffect, useRef } from 'react';

/** Preserve the selected slide when the container changes width. */
export function useCarouselResize(viewportRef, onResize) {
  const callbackRef = useRef(onResize);
  callbackRef.current = onResize;
  useEffect(() => {
    if (!viewportRef.current) return undefined;
    let frame;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => callbackRef.current());
    });
    observer.observe(viewportRef.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [viewportRef]);
}
