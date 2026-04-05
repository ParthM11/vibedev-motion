import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useVibeScroll } from '../../hooks/useVibeScroll';

export interface VibeParallaxLayerProps {
  children: React.ReactNode;
  depth?: number; // 0 is fixed, 1 is regular scroll, > 1 is fast, < 1 is slow
  intensity?: number;
  offset?: number;
}

/**
 * VibeParallaxLayer: A depth-aware parallax component.
 * Elements move faster or slower based on their 'depth' value.
 */
export const VibeParallaxLayer: React.FC<VibeParallaxLayerProps> = ({
  children,
  depth = 0.5,
  intensity = 100,
  offset = 0
}) => {
  const { scrollYProgress } = useVibeScroll();
  
  // Higher depth value means more movement (closer to viewer)
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [-intensity * depth, intensity * depth]
  );
  
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [-5 * depth, 5 * depth]
  );

  return (
    <motion.div
      style={{
        y,
        rotate,
        translateY: offset,
      }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};
