import { useCallback, useRef, useMemo, useEffect } from 'react';
import { useSpring } from 'framer-motion';
import { useVibeTheme } from '../context/VibeContext';
import { VibePhysics } from '../types';

export interface GravityOptions {
  strength?: number;
  range?: number;
  axis?: 'x' | 'y' | 'both';
  customPhysics?: Partial<VibePhysics>;
}

export function useGravityUI(options: GravityOptions = {}) {
  const { vibe } = useVibeTheme();
  
  const {
    strength = 0.5,
    range = 300,
    axis = 'both',
    customPhysics = {},
  } = options;

  const physics = useMemo(() => ({
    ...vibe.physics,
    ...customPhysics,
  }), [vibe.physics, customPhysics]);

  const elementRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const x = useSpring(0, physics);
  const y = useSpring(0, physics);

  const handleMouseMove = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      // Use requestAnimationFrame for buttery smooth tracking
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < range) {
          // Normalize the pull based on distance (stronger as you get closer)
          const pullFactor = 1 - (distance / range);
          const pullX = dx * strength * pullFactor;
          const pullY = dy * strength * pullFactor;
          
          if (axis === 'both' || axis === 'x') x.set(pullX);
          if (axis === 'both' || axis === 'y') y.set(pullY);
        } else {
          x.set(0);
          y.set(0);
        }
      });
    },
    [range, strength, x, y, axis]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    bind: {
      ref: (node: HTMLElement | null) => {
        elementRef.current = node;
      },
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      style: {
        x,
        y,
      },
    },
    x,
    y,
    theme: vibe,
  };
}
