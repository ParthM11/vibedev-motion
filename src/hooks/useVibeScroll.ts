import { useScroll as useFramerScroll, useSpring, useVelocity, MotionValue } from 'framer-motion';
import { useMemo } from 'react';

export interface UseVibeScrollOptions {
  smooth?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
  target?: React.RefObject<any>;
  offset?: any;
}

/**
 * useVibeScroll: A physics-enhanced scroll hook that provides
 * momentum-aware scroll metrics and optional spring smoothing.
 */
export function useVibeScroll(options: UseVibeScrollOptions = {}) {
  const { 
    smooth = true, 
    stiffness = 100, 
    damping = 30, 
    mass = 1,
    target,
    offset
  } = options;

  const { scrollY, scrollX, scrollYProgress, scrollXProgress } = useFramerScroll({
    target,
    offset
  });

  // Create spring-smoothed versions if requested
  const smoothY = useSpring(scrollY, { stiffness, damping, mass });
  const smoothX = useSpring(scrollX, { stiffness, damping, mass });
  const smoothYProgress = useSpring(scrollYProgress, { stiffness, damping, mass });
  const smoothXProgress = useSpring(scrollXProgress, { stiffness, damping, mass });

  // Track velocity for physics interactions
  const velocityY = useVelocity(scrollY);
  const velocityX = useVelocity(scrollX);

  return useMemo(() => ({
    scrollY: smooth ? smoothY : scrollY,
    scrollX: smooth ? smoothX : scrollX,
    scrollYProgress: smooth ? smoothYProgress : scrollYProgress,
    scrollXProgress: smooth ? smoothXProgress : scrollXProgress,
    velocity: {
      y: velocityY,
      x: velocityX
    },
    // Raw values for cases where smoothing isn't desired
    raw: {
      scrollY,
      scrollX,
      scrollYProgress,
      scrollXProgress
    }
  }), [smooth, smoothY, scrollY, smoothX, scrollX, smoothYProgress, scrollYProgress, smoothXProgress, scrollXProgress, velocityY, velocityX]);
}
