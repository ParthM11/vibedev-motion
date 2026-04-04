import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useBody } from '../physics/useBody';
import { useGravityUI } from '../hooks/useGravityUI';

/**
 * vibe.motion: An enhanced motion.div that automatically includes
 * Vibe's unique physics and presets.
 */
export const VibeMotion = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & {
  physics?: boolean;
}> (({ children, physics, ...props }, ref) => {
  // Use the existing gravity hook if needed
  const { bind } = useGravityUI();

  return (
    <motion.div
      {...(physics ? bind : {})}
      {...props}
      ref={ref}
    >
      {children}
    </motion.div>
  );
});

/**
 * vibe.body: A component that turns a UI element into a physical body
 * with collisions and gravity.
 */
export const VibeBody: React.FC<{
  children: React.ReactNode;
  type?: 'dynamic' | 'fixed';
  initialPosition?: { x: number; y: number };
}> = ({ children, type = 'dynamic', initialPosition }) => {
  const { transform } = useBody({ type, position: initialPosition });

  return (
    <div style={{
      transform: `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotation}rad)`,
      position: 'absolute'
    }}>
      {children}
    </div>
  );
};

export const vibe = {
  motion: VibeMotion,
  body: VibeBody
};
