export * from './hooks/useGravityUI';
export * from './hooks/useEnvironmentalLight';
export * from './hooks/useAutoExperience';
export * from './hooks/useVibeLayout';
export * from './hooks/useVibeScroll';
export * from './hooks/useVibeInView';
export { usePhysicalDrag } from './hooks/usePhysicalDrag';
export * from './context/VibeContext';
export * from './components/VibeReveal';
export * from './components/vibe';
export { AnimatePresence } from './components/AnimatePresence';
export { Reorder } from './components/Reorder';
export * from './components/scroll/VibeProgress';
export * from './components/scroll/VibeHorizontalScroll';
export * from './components/scroll/VibeParallaxLayer';
export * from './motion/ScrollPhysics';
export * from './motion/SVGPhysics';
export * from './physics/PhysicsProvider';
export * from './physics/useBody';
export * from './types';
export * from './presets';

// Re-export Framer Motion primitives under 'motion' (excluding AnimatePresence to avoid conflict)
export * from './motion';
