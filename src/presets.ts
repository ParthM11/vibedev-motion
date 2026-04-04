import { VibePhysics } from './types';

/**
 * Production-grade spring configurations for that "Elite" feel.
 */
export const VIBE_PRESETS: Record<string, VibePhysics> = {
  /**
   * ELEGANT: Soft damping, high mass, organic curves. (Apple-esque)
   */
  ELEGANT: {
    stiffness: 120,
    damping: 20,
    mass: 1,
    restDelta: 0.001,
  },
  /**
   * RESPONSIVE: High stiffness, zero mass, snappy reaction. (Cyber-sharp)
   */
  RESPONSIVE: {
    stiffness: 400,
    damping: 30,
    mass: 0.1,
    restDelta: 0.001,
  },
  /**
   * BOUNCY: Low damping, playful overshoot.
   */
  BOUNCY: {
    stiffness: 200,
    damping: 10,
    mass: 1,
    restDelta: 0.001,
  },
  /**
   * LAZY: High mass, slow smooth return.
   */
  LAZY: {
    stiffness: 50,
    damping: 15,
    mass: 2,
    restDelta: 0.001,
  },
};
