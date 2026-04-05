import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SVGPhysics } from '../../motion/SVGPhysics';

export interface VibeChainProps {
  path: string;
  segmentCount?: number;
  color?: string;
  width?: number;
  physics?: boolean;
}

/**
 * VibeChain: A component that converts an SVG path into a physical rope/chain.
 * It uses SVGPhysics for simulation and renders a dynamic path that follows 
 * the simulation points.
 */
export const VibeChain: React.FC<VibeChainProps> = ({
  path,
  segmentCount = 15,
  color = 'currentColor',
  width = 2,
  physics = true
}) => {
  const [points, setPoints] = useState<{ x: number, y: number }[]>([]);

  // Generate a dynamic SVG path string from the physical points
  const dynamicPath = useMemo(() => {
    if (!points.length) return path;
    
    // Create a smooth curve through the points
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, [points, path]);

  return (
    <>
      <SVGPhysics 
        path={path} 
        segmentCount={segmentCount} 
        physics={physics} 
        onUpdate={setPoints} 
      />
      <svg style={{ overflow: 'visible', position: 'absolute', pointerEvents: 'none' }}>
        <motion.path
          d={dynamicPath}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ d: dynamicPath }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </svg>
    </>
  );
};
