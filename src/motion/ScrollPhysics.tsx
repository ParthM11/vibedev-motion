import React, { useEffect } from 'react';
import { usePhysics } from '../physics/PhysicsProvider';
import { useVibeScroll } from '../hooks/useVibeScroll';

/**
 * ScrollPhysics: A component that applies global physical forces 
 * based on the user's scroll speed and direction.
 */
export const ScrollPhysics: React.FC<{
  intensity?: number;
  direction?: 'vertical' | 'horizontal';
  forceType?: 'impulse' | 'gravity';
  damping?: number;
}> = ({ 
  intensity = 1.0, 
  direction = 'vertical', 
  forceType = 'impulse',
  damping = 0.95
}) => {
  const { world } = usePhysics();
  const { velocity } = useVibeScroll();

  useEffect(() => {
    const unsub = (direction === 'vertical' ? velocity.y : velocity.x).on('change', (v) => {
      if (!world) return;
      
      const magnitude = v * 0.005 * intensity;
      
      if (forceType === 'impulse') {
        const force = direction === 'vertical' ? { x: 0, y: magnitude } : { x: magnitude, y: 0 };
        world.forEachRigidBody((body) => {
          if (body.bodyType() === 0) { // Dynamic
             body.applyImpulse(force, true);
          }
        });
      } else {
        // Gravity shift
        const targetGravity = direction === 'vertical' ? { x: 0, y: magnitude - 9.81 } : { x: magnitude, y: -9.81 };
        world.gravity = targetGravity;
      }
    });

    return () => {
      unsub();
    };
  }, [world, intensity, direction, forceType, velocity]);

  return null;
};
