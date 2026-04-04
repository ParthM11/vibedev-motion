import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { VibeType, VibeTheme, VIBE_CONFIGS } from '../types';

interface VibeContextProps {
  vibe: VibeTheme;
  setVibe: (type: VibeType) => void;
}

const VibeContext = createContext<VibeContextProps | undefined>(undefined);

export function VibeProvider({ children, initialVibe = 'apple' }: { children: ReactNode; initialVibe?: VibeType }) {
  const [vibeType, setVibeType] = useState<VibeType>(initialVibe);

  const value = useMemo(() => ({
    vibe: VIBE_CONFIGS[vibeType],
    setVibe: (type: VibeType) => setVibeType(type),
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
