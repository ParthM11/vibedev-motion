import { useInView as useFramerInView, UseInViewOptions } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { usePhysics } from '../physics/PhysicsProvider';

export interface UseVibeInViewOptions extends UseInViewOptions {
  physicsImpulse?: number; // Momentary force on entry
  physicsGravity?: number; // Momentary gravity shift on entry
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * useVibeInView: A hook that monitors element visibility in the viewport
 * and can trigger physics-based impulses or events.
 */
export function useVibeInView(ref: React.RefObject<any>, options: UseVibeInViewOptions = {}) {
  const { 
    physicsImpulse = 0, 
    physicsGravity = 0, 
    direction = 'up',
    ...framerOptions 
  } = options;

  const isInView = useFramerInView(ref, framerOptions);
  const { world } = usePhysics();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (isInView && !hasTriggered.current && world) {
      // Find the rigid body associated with this ref (if any)
      // This is a bit tricky, we might need a registry of refs to bodies
      // For now, let's just trigger a global impulse or gravity shift
      
      if (physicsImpulse !== 0) {
        const force = { 
            x: direction === 'left' ? -physicsImpulse : direction === 'right' ? physicsImpulse : 0,
            y: direction === 'up' ? -physicsImpulse : direction === 'down' ? physicsImpulse : 0
        };
        
        // This is a global 'shockwave' effect
        world.forEachRigidBody((body) => {
          if (body.bodyType() === 0) { // Dynamic
            body.applyImpulse(force, true);
          }
        });
      }

      if (physicsGravity !== 0) {
        const originalGravity = world.gravity;
        const shift = direction === 'up' ? { x: 0, y: physicsGravity } : { x: 0, y: -physicsGravity };
        world.gravity = shift;
        
        setTimeout(() => {
            world.gravity = originalGravity;
        }, 500); // Temporary gravity shift
      }

      if (framerOptions.once) {
        hasTriggered.current = true;
      }
    } else if (!isInView) {
      hasTriggered.current = false;
    }
  }, [isInView, world, physicsImpulse, physicsGravity, direction, framerOptions.once]);

  return isInView;
}
