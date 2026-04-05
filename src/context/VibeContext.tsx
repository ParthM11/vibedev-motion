import React, { createContext, useContext, useState, useMemo, ReactNode, useRef } from 'react';
import { VibeType, VibeTheme, VIBE_CONFIGS } from '../types';

interface VibeContextProps {
  vibe: VibeTheme;
  setVibe: (type: VibeType) => void;
  layoutRegistry: Map<string, { rect: DOMRect; velocity?: { x: number; y: number }; mass?: number }>;
  registerLayout: (id: string, data: any) => void;
}

const VibeContext = createContext<VibeContextProps | undefined>(undefined);

export function VibeProvider({ children, initialVibe = 'apple' }: { children: ReactNode; initialVibe?: VibeType }) {
  const [vibeType, setVibeType] = useState<VibeType>(initialVibe);
  const layoutRegistry = useRef(new Map<string, any>());

  const value = useMemo(() => ({
    vibe: VIBE_CONFIGS[vibeType],
    setVibe: (type: VibeType) => setVibeType(type),
    layoutRegistry: layoutRegistry.current,
    registerLayout: (id: string, data: any) => {
      layoutRegistry.current.set(id, data);
    },
  }), [vibeType]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
}

export function useVibeTheme() {
  const context = useContext(VibeContext);
  if (context === undefined) {
    throw new Error('useVibeTheme must be used within a VibeProvider');
  }
  return context;
}
