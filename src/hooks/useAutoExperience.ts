import { useEffect } from 'react';

export interface AutoExperienceOptions {
  selectors?: string[];
  intensity?: number;
}

export function useAutoExperience(options: AutoExperienceOptions = {}) {
  const {
    selectors = ['button', 'a', '.vibe-card', '[data-vibe]'],
    intensity = 15,
  } = options;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll(selectors.join(','));
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Threshold for attraction
        if (distance < 150) {
          const x = (dx / 150) * intensity;
          const y = (dy / 150) * intensity;
          (el as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`;
          (el as HTMLElement).style.transition = 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)';
        } else {
          (el as HTMLElement).style.transform = `translate3d(0, 0, 0)`;
        }
      });
    };

    const handleMouseLeave = () => {
      const elements = document.querySelectorAll(selectors.join(','));
      elements.forEach((el) => {
        (el as HTMLElement).style.transform = `translate3d(0, 0, 0)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [selectors, intensity]);
}
