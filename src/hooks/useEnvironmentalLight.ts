import { useEffect, useState } from 'react';

/**
 * useEnvironmentalLight: A "crazy level" hook that treats the cursor
 * as a light source, casting dynamic shadows for all elements.
 */
export const useEnvironmentalLight = (options: {
  intensity?: number;
  color?: string;
  blur?: number;
} = {}) => {
  const { intensity = 15, color = 'rgba(0,0,0,0.3)', blur = 10 } = options;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update global CSS variables that elements can use for their box-shadow
      document.documentElement.style.setProperty('--vibe-light-x', `${x}px`);
      document.documentElement.style.setProperty('--vibe-light-y', `${y}px`);
      
      // Calculate individual shadow offsets for each marked element
      const elements = document.querySelectorAll('.vibe-cast-shadow');
      elements.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (centerX - x) / intensity;
        const deltaY = (centerY - y) / intensity;

        (el as HTMLElement).style.boxShadow = `${deltaX}px ${deltaY}px ${blur}px ${color}`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity, color, blur]);
};
