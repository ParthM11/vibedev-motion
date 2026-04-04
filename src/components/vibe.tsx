import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBody } from '../physics/useBody';
import { useGravityUI } from '../hooks/useGravityUI';
import { usePhysicalDrag } from '../hooks/usePhysicalDrag';

/**
 * Elements supported by the 'vibe' motion proxy.
 */
const elements = [
  'a', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col',
  'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
  'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure',
  'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
  'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
  'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta',
  'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option',
  'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source',
  'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody',
  'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title',
  'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
] as const;

/**
 * VibeMotion: An enhanced motion component that supports any HTML element
 * via the 'as' prop and includes Vibe's physics.
 */
export const VibeMotion = React.forwardRef<any, any>(
  ({ children, physics, as = 'div', physicsExit, drag, dragConstraints, ...props }, ref) => {
    // 1. Interactive Gravity (Mouse Pull)
    const { bind } = useGravityUI();

    // 2. Rigid Body Physics (Optional)
    const physicsOptions = useMemo(() => ({
      type: (physics === 'fixed' ? 'fixed' : 'dynamic') as 'fixed' | 'dynamic',
      enabled: !!physics || !!drag,
    }), [physics, drag]);

    const { body, transform } = useBody({
      type: physicsOptions.type,
      enabled: physicsOptions.enabled,
    } as any);

    // 3. Physical Drag (Optional)
    const { onDrag, onDragEnd } = usePhysicalDrag(body, {
      enabled: !!drag,
    });

    // Toggle physics-driven styles vs Framer Motion styles
    const physicsStyles = physicsOptions.enabled ? {
      x: transform.x,
      y: transform.y,
      rotate: transform.rotation,
      position: 'absolute' as const,
    } : {};

    // Map the tag to the motion component
    const Component = (motion as any)[as];

    return (
      <Component
        {...(physics === true ? bind : {})}
        {...(drag ? { onDrag, onDragEnd } : {})}
        {...props}
        style={{
          ...props.style,
          ...physicsStyles,
        }}
        drag={drag}
        dragConstraints={dragConstraints}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

type VibeComponents = {
  [K in typeof elements[number]]: typeof VibeMotion;
};

/**
 * The 'vibe' object provides a set of physics-enabled motion components
 * for every standard HTML element, mirroring the 'motion' API.
 */
const vibeProxy = new Proxy({} as VibeComponents, {
  get: (_, prop: string) => {
    if (elements.includes(prop as any)) {
      return React.forwardRef((props: any, ref: any) => (
        <VibeMotion as={prop} {...props} ref={ref} />
      ));
    }
    return undefined;
  },
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
  ...vibeProxy,
  motion: VibeMotion,
  body: VibeBody
};
