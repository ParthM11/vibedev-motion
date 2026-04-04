import { useLayoutEffect, useRef, useCallback } from 'react';
import { useSpring } from 'framer-motion';
import { useVibeTheme } from '../context/VibeContext';

/**
 * useVibeLayout()
 * Implements FLIP (First, Last, Invert, Play) technique for smooth morphing.
 * When the element's layout changes (e.g. window resize, re-order), it animates
 * from its source position to its new destination.
 */
export function useVibeLayout() {
  const { vibe } = useVibeTheme();
  const elementRef = useRef<HTMLElement | null>(null);
  const firstRectRef = useRef<DOMRect | null>(null);

  const x = useSpring(0, vibe.physics);
  const y = useSpring(0, vibe.physics);

  const snapshot = useCallback(() => {
    if (elementRef.current) {
      firstRectRef.current = elementRef.current.getBoundingClientRect();
    }
  }, []);

  useLayoutEffect(() => {
    if (!elementRef.current || !firstRectRef.current) return;

    const lastRect = elementRef.current.getBoundingClientRect();
    const invertX = firstRectRef.current.left - lastRect.left;
    const invertY = firstRectRef.current.top - lastRect.top;

    if (invertX !== 0 || invertY !== 0) {
      // Temporarily set the position to the "first" position
      x.set(invertX);
      y.set(invertY);
      
      // Animate back to 0 (destination)
      // requestAnimationFrame ensures we start after the browser layout
      requestAnimationFrame(() => {
        x.set(0);
        y.set(0);
      });
    }
  });

  return {
    ref: (node: HTMLElement | null) => {
      elementRef.current = node;
    },
    snapshot,
    style: {
      x,
      y,
    },
  };
}
