import React, { useRef } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useVibeScroll } from '../../hooks/useVibeScroll';

export interface VibeHorizontalScrollProps {
  children: React.ReactNode[];
  intensity?: number;
  gap?: number;
  containerHeight?: string;
}

/**
 * VibeHorizontalScroll: A vertically-scrolled horizontal gallery 
 * that translates vertical distance into a physical horizontal slide.
 */
export const VibeHorizontalScroll: React.FC<VibeHorizontalScrollProps> = ({
  children,
  intensity = 1.0,
  gap = 20,
  containerHeight = '300vh'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useVibeScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
    smooth: true,
    stiffness: 70,
    damping: 15
  });

  // Calculate the horizontal translation based on scroll progress
  // We move from 0% to -(100% - containerWidth)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(children.length - 1) * 80}%`]);

  return (
    <div ref={containerRef} style={{ height: containerHeight, position: 'relative' }}>
      <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
      }}>
        <motion.div
           style={{
             x,
             display: 'flex',
             gap: `${gap}px`,
             padding: '0 5vw',
           }}
        >
          {children.map((child, i) => (
            <div key={i} style={{ flexShrink: 0, width: '80vw' }}>
              {child}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
