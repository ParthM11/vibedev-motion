import React, { PropsWithChildren } from 'react';
import { AnimatePresence as FramerAnimatePresence, AnimatePresenceProps } from 'framer-motion';

/**
 * VibeAnimatePresence: Wraps Framer Motion's AnimatePresence
 * and provides hooks for physics-based exit animations.
 */
export const VibeAnimatePresence: React.FC<PropsWithChildren<AnimatePresenceProps & {
  physicsExit?: boolean;
}>> = ({ children, physicsExit, ...props }) => {
  return (
    <FramerAnimatePresence {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && physicsExit) {
          // Clone child and inject physicsExit prop if it's a Vibe component
          return React.cloneElement(child as React.ReactElement<any>, {
            physicsExit: true,
          });
        }
        return child;
      })}
    </FramerAnimatePresence>
  );
};

export const AnimatePresence = VibeAnimatePresence;
