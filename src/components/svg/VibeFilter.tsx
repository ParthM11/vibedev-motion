import React, { useMemo } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useVibeScroll } from '../../hooks/useVibeScroll';

export interface VibeTurbulenceProps {
  id: string;
  baseFrequency?: number;
  numOctaves?: number;
  seed?: number;
  reactivity?: number;
}

/**
 * VibeTurbulence: A physics-linked SVG turbulence filter.
 * The distortion frequency increases with scroll velocity.
 */
export const VibeTurbulence: React.FC<VibeTurbulenceProps> = ({
  id,
  baseFrequency = 0.05,
  numOctaves = 2,
  seed = 1,
  reactivity = 0.005
}) => {
  const { velocity } = useVibeScroll();
  
  // Link frequency to scroll velocity
  const frequency = useTransform(
    velocity.y,
    [-1000, 1000],
    [baseFrequency + reactivity, baseFrequency + reactivity]
  );

  return (
    <filter id={id}>
      <motion.feTurbulence
        type="fractalNoise"
        baseFrequency={frequency}
        numOctaves={numOctaves}
        seed={seed}
        result="noise"
      />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
    </filter>
  );
};

export const VibeFilter = {
  Turbulence: VibeTurbulence
};
