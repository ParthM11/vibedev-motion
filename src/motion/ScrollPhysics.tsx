import React, { useEffect, useRef } from 'react';
import { useScroll, useVelocity } from 'framer-motion';
import { usePhysics } from '../physics/PhysicsProvider';

/**
 * ScrollPhysics: A component that applies global physical forces 
 * based on the user's scroll speed and direction.
 */
export const ScrollPhysics: React.FC<{
  intensity?: number;
  direction?: 'vertical' | 'horizontal';
}> = ({ intensity = 1.0, direction = 'vertical' }) => {
  const { world } = usePhysics();
  const { scrollY, scrollX } = useScroll();
  
  // Track scroll velocity using Framer Motion
  const velocityY = useVelocity(scrollY);
  const velocityX = useVelocity(scrollX);

  useEffect(() => {
    const unsubY = velocityY.on('change', (v) => {
      if (!world || direction !== 'vertical') return;
      
      // Apply a global gravity shift or force based on scroll velocity
      const force = { x: 0, y: v * 0.01 * intensity };
      world.forEachRigidBody((body) => {
        if (body.bodyType() === 0) { // Dynamic
           body.applyImpulse(force, true);
        }
      });
    });

    const unsubX = velocityX.on('change', (v) => {
      if (!world || direction !== 'horizontal') return;
      
      const force = { x: v * 0.01 * intensity, y: 0 };
      world.forEachRigidBody((body) => {
        if (body.bodyType() === 0) { // Dynamic
           body.applyImpulse(force, true);
        }
      });
    });

    return () => {
      unsubY();
      unsubX();
    };
  }, [world, intensity, direction, velocityY, velocityX]);

  return null; // This is a utility component
};
