import { VibePhysics } from '../types';

/**
 * Converts modern spring parameters (visualDuration, bounce) to 
 * physical properties (stiffness, damping, mass).
 * 
 * Logic based on standard harmonic oscillator formulas adapted for UI.
 */
export function calcSpringPhysics(props: VibePhysics): VibePhysics {
  const { visualDuration, bounce = 0, mass = 1 } = props;

  if (visualDuration === undefined) {
    return {
      stiffness: props.stiffness ?? 100,
      damping: props.damping ?? 10,
      mass: props.mass ?? 1,
    };
  }

  // 1. Calculate Damping Ratio from Bounce
  // Bounce 0 -> Damping Ratio 1 (Critical)
  // Bounce 1 -> Damping Ratio 0 (No damping)
  const dampingRatio = 1 - bounce;

  // 2. Calculate Angular Frequency (Undamped)
  // visualDuration is roughly the time to reach target.
  // For critical damping, t = 1 / omega. 
  // We use a factor (e.g. 2 * PI / T) to align with visual expectations.
  const response = visualDuration || 0.5;
  const omega = (2 * Math.PI) / response;

  // 3. Convert to Stiffness and Damping
  const stiffness = omega * omega * mass;
  const damping = 2 * dampingRatio * omega * mass;

  return {
    stiffness: Math.max(0.1, stiffness),
    damping: Math.max(0.1, damping),
    mass,
    visualDuration,
    bounce
  };
}

/**
 * Simulates a single step of a spring-mass-damper system.
 * Useful for high-performance physics sync outside the main solver.
 */
export function solveSpringStep(
    current: number, 
    target: number, 
    velocity: number, 
    physics: VibePhysics, 
    dt: number = 0.016
) {
    const { stiffness = 100, damping = 10, mass = 1 } = physics;
    
    const force = -stiffness * (current - target) - damping * velocity;
    const acceleration = force / mass;
    const newVelocity = velocity + acceleration * dt;
    const newValue = current + newVelocity * dt;
    
    return { value: newValue, velocity: newVelocity };
}
