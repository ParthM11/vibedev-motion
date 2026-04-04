export type VibeType = 'apple' | 'cyber' | 'minimal' | 'glitch';

export interface VibePhysics {
  stiffness: number;
  damping: number;
  mass: number;
  restDelta?: number;
}

export interface VibeTheme {
  type: VibeType;
  physics: VibePhysics;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const VIBE_CONFIGS: Record<VibeType, VibeTheme> = {
  apple: {
    type: 'apple',
    physics: { stiffness: 120, damping: 20, mass: 1 },
    colors: {
      primary: '#0071e3',
      secondary: '#86868b',
      background: '#ffffff',
      text: '#1d1d1f',
      accent: '#0071e3',
    },
  },
  cyber: {
    type: 'cyber',
    physics: { stiffness: 300, damping: 10, mass: 0.1 },
    colors: {
      primary: '#00ff41',
      secondary: '#ff003c',
      background: '#0a0a0a',
      text: '#ffffff',
      accent: '#00f6ff',
    },
  },
  minimal: {
    type: 'minimal',
    physics: { stiffness: 80, damping: 30, mass: 1.5 },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#f5f5f7',
      text: '#1d1d1f',
      accent: '#333333',
    },
  },
  glitch: {
    type: 'glitch',
    physics: { stiffness: 500, damping: 5, mass: 0.05 },
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      background: '#000000',
      text: '#ffffff',
      accent: '#ffff00',
    },
  },
};
