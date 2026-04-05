import { useLayoutEffect, useRef, useCallback } from 'react';
import { useSpring } from 'framer-motion';
import { useVibeTheme } from '../context/VibeContext';
import { RigidBody } from '@dimforge/rapier2d';
import { VibeTransition } from '../types';
import { calcSpringPhysics } from '../utils/spring';

export interface PhysicalLayoutOptions extends VibeTransition {
  layout?: boolean | 'position' | 'physics';
  layoutId?: string;
  transition?: VibeTransition;
}

/**
 * usePhysicalLayout
 * 
 * A next-generation layout animation hook that uses Rapier physics
 * to solve layout transitions via Impulse-FLIP.
 */
export function usePhysicalLayout(
    body: RigidBody | null, 
    setTarget: (pos: { x: number, y: number }) => void, 
    options: PhysicalLayoutOptions = {}
) {
  const { vibe, layoutRegistry, registerLayout } = useVibeTheme();
  const { layout, layoutId, transition } = options;
  
  const elementRef = useRef<HTMLElement | null>(null);
  const firstRectRef = useRef<DOMRect | null>(null);

  // Merge local transition with theme defaults
  const activePhysics = calcSpringPhysics({
      ...vibe.physics,
      ...transition,
  });

  // Fallback springs for non-physics layout modes
  const x = useSpring(0, activePhysics);
  const y = useSpring(0, activePhysics);

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
          // Physical FLIP: Set initial simulation position and target
          // This allows the body to 'drift' back to its new DOM position physically
          const currentSimPos = body.translation();
          // We apply the invert to the body's translation immediately 
          // so it's physically where it 'was' visually.
          body.setTranslation({ 
              x: currentSimPos.x + (invertX * 0.01), 
              y: currentSimPos.y + (invertY * 0.01) 
          }, true);
          
          // The target is the current simulation baseline (rest position)
          setTarget({ x: currentSimPos.x, y: currentSimPos.y });
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
