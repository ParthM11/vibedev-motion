import React, { createContext, useContext, useState, useMemo, ReactNode, useRef } from 'react';
import { VibeType, VibeTheme, VIBE_CONFIGS, VibeTransition } from '../types';

interface VibeContextProps {
  vibe: VibeTheme;
  setVibe: (type: VibeType) => void;
  transition?: VibeTransition;
  layoutRegistry: Map<string, { rect: DOMRect; velocity?: { x: number; y: number }; mass?: number }>;
  registerLayout: (id: string, data: any) => void;
}

const VibeContext = createContext<VibeContextProps | undefined>(undefined);

export function VibeProvider({ 
    children, 
    initialVibe = 'apple',
    transition
}: { 
    children: ReactNode; 
    initialVibe?: VibeType;
    transition?: VibeTransition;
}) {
  const [vibeType, setVibeType] = useState<VibeType>(initialVibe);
  const layoutRegistry = useRef(new Map<string, any>());

  const value = useMemo(() => ({
    vibe: VIBE_CONFIGS[vibeType],
    setVibe: (type: VibeType) => setVibeType(type),
    transition,
    layoutRegistry: layoutRegistry.current,
    registerLayout: (id: string, data: any) => {
      layoutRegistry.current.set(id, data);
    },
  }), [vibeType, transition]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
}

export function useVibeTheme() {
  const context = useContext(VibeContext);
  if (context === undefined) {
    throw new Error('useVibeTheme must be used within a VibeProvider');
  }
  return context;
}
