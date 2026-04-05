import React, { useState, useEffect } from 'react';
import { vibe, VibeProvider, PhysicsProvider, LayoutGroup } from '../index';

/**
 * LayoutStress: High-Frequency Reordering
 * 
 * Shuffles 30 items every 500ms to test the Impulse-FLIP stability.
 * If elements "jitter" or "detach" from their physical bodies, the test fails.
 */
export const LayoutStress = () => {
  const [items, setItems] = useState(() => Array.from({ length: 30 }).map((_, i) => i));

  useEffect(() => {
    const id = setInterval(() => {
      setItems(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 500); // EXTREME: 2 shuffles per second
    return () => clearInterval(id);
  }, []);

  return (
    <VibeProvider>
      <PhysicsProvider>
        <div style={{ padding: 40, color: '#fff', background: '#050505', minHeight: '100vh' }}>
          <h2 style={{ color: 'var(--accent)' }}>VibeDev Layout Stress: Phase 3</h2>
          <p style={{ margin: '10px 0', color: 'var(--text-dim)' }}>
            Shuffling 30 items with <code>layout="physics"</code> every 500ms.
          </p>

          <LayoutGroup>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: 20, 
              marginTop: 40,
              width: 600,
              margin: '0 auto',
              position: 'relative'
            }}>
              {items.map(item => (
                <vibe.div 
                  key={item} 
                  layout="physics"
                  transition={{ visualDuration: 0.4, bounce: 0.2 }}
                  style={{ 
                    height: 80, 
                    background: 'rgba(0, 255, 204, 0.1)', 
                    border: '1px solid var(--accent)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    color: 'var(--accent)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }} 
                >
                  {item}
                </vibe.div>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </PhysicsProvider>
    </VibeProvider>
  );
};
