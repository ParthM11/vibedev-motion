export * from './hooks/useGravityUI';
export * from './hooks/useEnvironmentalLight';
export * from './hooks/useAutoExperience';
export * from './hooks/useVibeLayout';
export * from './context/VibeContext';
export * from './components/VibeReveal';
export * from './components/vibe';
export * from './physics/PhysicsProvider';
export * from './physics/useBody';
export * from './types';
export * from './presets';

import { VIBE_PRESETS } from './presets';
import { vibe } from './components/vibe';

export { VIBE_PRESETS, vibe };

// Re-export Framer Motion primitives under 'motion'
export * from './motion';
