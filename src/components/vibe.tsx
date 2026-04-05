import React, { useMemo, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useBody } from '../physics/useBody';
import { useGravityUI } from '../hooks/useGravityUI';
import { usePhysicalDrag } from '../hooks/usePhysicalDrag';
import { usePhysicalLayout } from '../hooks/usePhysicalLayout';
import { useVibeScroll } from '../hooks/useVibeScroll';
import { useVibeInView } from '../hooks/useVibeInView';
import { useVibeTheme } from '../context/VibeContext';
import { calcSpringPhysics } from '../utils/spring';


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
  'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',
  // SVG Elements
  'svg', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath',
  'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
  'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG',
  'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'filter', 'foreignObject', 'g', 'image', 'line', 'linearGradient',
  'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline',
  'radialGradient', 'rect', 'set', 'stop', 'switch', 'symbol', 'text', 'textPath',
  'tspan', 'use', 'view'
] as const;

/**
 * VibeMotion: An enhanced motion component that supports any HTML element
 * via the 'as' prop and includes Vibe's physics and optimized layout animations.
 */
export const VibeMotion = React.forwardRef<any, any>(
  ({ 
    children, 
    physics, 
    as = 'div', 
    physicsExit, 
    drag, 
    dragConstraints, 
    layout, 
    layoutId, 
    whileInView, 
    viewport, 
    parallax,
    transition,
    ...props 
  }, ref) => {
    const { vibe: themeVibe } = useVibeTheme();

    // 0. Optimized Transition & Spring Solver Mapping
    const activePhysics = useMemo(() => calcSpringPhysics({
        ...themeVibe.physics,
        ...transition,
    }), [themeVibe.physics, transition]);

    // 1. Interactive Gravity (Mouse Pull)
    const { bind } = useGravityUI();

    // 2. Rigid Body Physics (Optional)
    const physicsOptions = useMemo(() => ({
      type: (physics === 'fixed' ? 'fixed' : 'dynamic') as 'fixed' | 'dynamic',
      enabled: !!physics || !!drag || layout === 'physics',
    }), [physics, drag, layout]);

    const { body, transform, setTarget, resetVelocity } = useBody({
      type: physicsOptions.type,
      enabled: physicsOptions.enabled,
      physicsProps: activePhysics
    } as any);

    // 3. Physical Layout Animation (Next-Level FLIP)
    const { ref: layoutRef, style: layoutStyle } = usePhysicalLayout(body, setTarget, {
        layout,
        layoutId,
        transition
    });

    // 4. Physical Drag (Optional)
    const { onDrag, onDragEnd } = usePhysicalDrag(body, {
      enabled: !!drag,
    });

    // 5. Physical Viewport Trigger
    const innerRef = useRef<HTMLElement>(null);
    const isInView = useVibeInView(innerRef, {
        ...viewport,
        physicsImpulse: typeof (whileInView as any)?.physics === 'number' 
            ? (whileInView as any).physics 
            : (whileInView as any)?.physics === true ? 5 : 0
    });

    // 6. Parallax Integration
    const { scrollYProgress } = useVibeScroll();
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, (parallax as any)?.y || 0]);
    const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, (parallax as any)?.rotate || 0]);

    // Toggle physics-driven styles vs Framer Motion styles
    const physicsStyles = physicsOptions.enabled ? {
      x: transform.x,
      y: transform.y,
      rotate: transform.rotation,
      position: 'absolute' as const,
    } : {};

    const parallaxStyles = (parallax as any) ? {
        y: parallaxY,
        rotate: parallaxRotate,
    } : {};

    // Combine refs
    const combinedRef = (node: any) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        (innerRef as any).current = node;
        layoutRef(node);
    };

    // Map the tag to the motion component
    const Component = (motion as any)[as];

    // 7. Automatic Scale Correction
    const counterScale = {
        transform: 'scale(var(--vibe-counter-scale-x, 1), var(--vibe-counter-scale-y, 1))'
    };

    // 8. SVG-Specific Defaults
    const isSVG = typeof as === 'string' && [
        'svg', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'g', 'text'
    ].includes(as);
    
    const svgStyles = isSVG ? {
        transformBox: 'fill-box' as any,
        transformOrigin: 'center'
    } : {};

    return (
      <Component
        {...(physics === true ? bind : {})}
        {...(drag ? { onDrag, onDragEnd } : {})}
        {...props}
        whileInView={whileInView}
        viewport={viewport}
        layout={layout}
        layoutId={layoutId}
        transition={transition}
        style={{
          ...props.style,
          ...physicsStyles,
          ...parallaxStyles,
          ...svgStyles,
          ...layoutStyle,
          '--vibe-parent-x': transform.x,
          '--vibe-parent-y': transform.y,
          ...counterScale
        } as any}
        drag={drag}
        dragConstraints={dragConstraints}
        ref={combinedRef}
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
