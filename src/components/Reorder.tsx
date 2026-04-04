import React from 'react';
import { Reorder as FramerReorder } from 'framer-motion';
import { VibeMotion } from './vibe';

/**
 * Reorder: A physics-enabled reordering list.
 * Items in this list will push each other aside using physical collisions.
 */
export const Reorder = {
  Group: ({ values, onReorder, children, ...props }: any) => {
    return (
      <FramerReorder.Group values={values} onReorder={onReorder} {...props}>
        {children}
      </FramerReorder.Group>
    );
  },
  Item: React.forwardRef(({ value, children, ...props }: any, ref: any) => {
    return (
      <FramerReorder.Item value={value} {...props} ref={ref}>
        {/* We wrap the content in VibeMotion to enable physics */}
        <VibeMotion physics={true} drag="y">
          {children}
        </VibeMotion>
      </FramerReorder.Item>
    );
  }),
};
