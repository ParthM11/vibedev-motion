import { useMotionValue } from 'framer-motion';
import { useCallback, useEffect } from 'react';

/**
 * usePhysicalDrag handles the translation between Framer Motion drag events
 * and Rapier physics impulses/velocity.
 */
export function usePhysicalDrag(body: any, options: { 
  enabled?: boolean;
  strength?: number;
} = {}) {
  const { enabled = true, strength = 2.0 } = options;

  const onDrag = useCallback((_: any, info: any) => {
    if (!enabled || !body) return;

    // Apply impulse based on drag velocity
    const impulse = {
      x: info.delta.x * strength,
      y: info.delta.y * strength,
    };

    body.applyImpulse(impulse, true);
  }, [body, enabled, strength]);

  const onDragEnd = useCallback((_: any, info: any) => {
    if (!enabled || !body) return;

    // Final "flick" impulse
    const velocity = {
      x: info.velocity.x * 0.1,
      y: info.velocity.y * 0.1,
    };

    body.setLinvel(velocity, true);
  }, [body, enabled]);

  return {
    onDrag,
    onDragEnd,
  };
}
