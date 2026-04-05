import { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { useSpring } from 'framer-motion';
import { useVibeTheme } from '../context/VibeContext';
import { RigidBody } from '@dimforge/rapier2d';

export interface PhysicalLayoutOptions {
  layout?: boolean | 'position' | 'physics';
  layoutId?: string;
  stiffness?: number;
  damping?: number;
}

/**
 * usePhysicalLayout
 * 
 * A next-generation layout animation hook that uses Rapier physics
 * to solve layout transitions via Impulse-FLIP.
 */
export function usePhysicalLayout(body: RigidBody | null, options: PhysicalLayoutOptions = {}) {
  const { vibe, layoutRegistry, registerLayout } = useVibeTheme();
  const { layout, layoutId, stiffness, damping } = options;
  
  const elementRef = useRef<HTMLElement | null>(null);
  const firstRectRef = useRef<DOMRect | null>(null);

  // Fallback springs for non-physics layout modes
  const x = useSpring(0, { stiffness: stiffness || vibe.physics.stiffness, damping: damping || vibe.physics.damping });
  const y = useSpring(0, { stiffness: stiffness || vibe.physics.stiffness, damping: damping || vibe.physics.damping });

  const snapshot = useCallback(() => {
    if (elementRef.current) {
      firstRectRef.current = elementRef.current.getBoundingClientRect();
    }
  }, []);

  useLayoutEffect(() => {
    if (!elementRef.current || !layout) return;

    // 1. Capture the "Last" position
    const lastRect = elementRef.current.getBoundingClientRect();

    // 2. Handle Shared Element Transition (layoutId)
    if (layoutId && !firstRectRef.current) {
        const sharedData = layoutRegistry.get(layoutId);
        if (sharedData) {
            firstRectRef.current = sharedData.rect;
            // Transfer physical properties if available
            if (body && sharedData.velocity) {
                body.setLinvel(sharedData.velocity, true);
            }
        }
    }

    if (!firstRectRef.current) return;

    // 3. Calculate Invert Delta
    const invertX = firstRectRef.current.left - lastRect.left;
    const invertY = firstRectRef.current.top - lastRect.top;

    if (invertX !== 0 || invertY !== 0) {
      if (layout === 'physics' && body) {
        // NEXT-LEVEL: Apply physical impulse instead of just a transform
        // Convert pixels to simulation units (1 unit = 100px)
        const impulse = {
            x: invertX * 0.1, 
            y: invertY * 0.1
        };
        body.applyImpulse(impulse, true);
      } else {
        // Standard FLIP via springs
        x.set(invertX);
        y.set(invertY);
        
        requestAnimationFrame(() => {
          x.set(0);
          y.set(0);
        });
      }
    }

    // Cleanup for next cycle
    return () => {
        if (layoutId && elementRef.current) {
            registerLayout(layoutId, {
                rect: elementRef.current.getBoundingClientRect(),
                velocity: body?.linvel(),
                mass: body?.mass()
            });
        }
    };
  });

  return {
    ref: (node: HTMLElement | null) => {
      elementRef.current = node;
    },
    snapshot,
    style: layout === 'physics' ? {} : { x, y },
  };
}
