import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useVibeScroll } from '../../hooks/useVibeScroll';

export interface VibeProgressProps {
  color?: string;
  height?: number | string;
  position?: 'top' | 'bottom';
  smoothing?: boolean;
}

/**
 * VibeProgress: A physics-enhanced reading progress bar.
 * It uses spring physics to create a momentum-aware filling effect.
 */
export const VibeProgress: React.FC<VibeProgressProps> = ({
  color = '#3b82f6',
  height = 4,
  position = 'top',
  smoothing = true
}) => {
  const { scrollYProgress } = useVibeScroll({ smooth: smoothing });

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        transformOrigin: '0%',
        backgroundColor: color,
        height,
        position: 'fixed',
        top: position === 'top' ? 0 : 'auto',
        bottom: position === 'bottom' ? 0 : 'auto',
        left: 0,
        right: 0,
        zIndex: 9999,
        boxShadow: `0 0 20px ${color}44`
      }}
    />
  );
};
