import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useVibeTheme } from '../context/VibeContext';

interface VibeRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
}

export function VibeReveal({ 
  children, 
  direction = 'up', 
  delay = 0,
  ...props 
}: VibeRevealProps) {
  const { vibe } = useVibeTheme();

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
      scale: vibe.type === 'cyber' ? 0.9 : 1,
      filter: vibe.type === 'glitch' ? 'blur(10px) brightness(2)' : 'none',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'none',
      transition: {
        ...vibe.physics,
        delay,
        duration: vibe.type === 'apple' ? 0.8 : 0.4,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
