import React from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';

export interface VibePathProps extends React.ComponentPropsWithoutRef<typeof motion.path> {
  elastic?: boolean;
  intensity?: number;
}

/**
 * VibePath: An enhanced SVG path component with 'Elastic Drawing' capabilities.
 * It uses spring physics on pathLength/offset to create a snappy, tactile drawing feel.
 */
export const VibePath = React.forwardRef<SVGPathElement, VibePathProps>(
  ({ elastic = true, intensity = 100, initial, animate, style, ...props }, ref) => {
    
    // If elastic is enabled, we intercept the pathLength/offset values
    // and wrap them in a spring for that 'snap-back' effect.
    
    // Note: Standard Framer Motion 'animate' handles 'transition' which can include 'type: spring'.
    // We enhance this by defaulting all path-related units to a custom physics preset.
    
    const physicsTransition = elastic ? {
      type: 'spring',
      stiffness: intensity * 2,
      damping: 15,
      mass: 0.8
    } : undefined;

    return (
      <motion.path
        ref={ref}
        initial={initial}
        animate={animate}
        transition={physicsTransition}
        style={{
            ...style,
            // Optimization: default to centered rotation
            transformBox: 'fill-box' as any,
            transformOrigin: 'center'
        }}
        {...props}
      />
    );
  }
);
