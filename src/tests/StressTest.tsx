import React, { useState, useEffect, useMemo } from 'react';
import { vibe, VibeProvider, PhysicsProvider } from '../index';

/**
 * StressTest: Physical Rain
 * 
 * Renders hundreds of physical bodies to measure the engine's limits.
 * We use spheres for high-density collision testing.
 */
const RainDrop = ({ id, x, y }: { id: number; x: number; y: number }) => (
  <vibe.div
    physics="dynamic"
    initial={{ x, y }}
    restitution={0.6}
    friction={0.1}
    style={{
      width: 20,
      height: 20,
      background: 'var(--accent)',
      borderRadius: '50%',
      position: 'absolute',
      boxShadow: '0 0 10px var(--accent-glow)'
    }}
  />
);

export const StressTest = ({ count = 300 }: { count?: number }) => {
  const [fps, setFps] = useState(0);
  const [active, setActive] = useState(false);
  
  // Create static floor for drops to hit
  const Floor = () => (
    <vibe.div
      physics="fixed"
      style={{
        width: '100vw',
        height: 100,
        background: 'rgba(255,255,255,0.1)',
        position: 'absolute',
        bottom: 0,
        left: 0
      }}
    />
  );

  const drops = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * -1000
    }));
  }, [count, active]);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(tick);
    };
    
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 100, color: '#fff' }}>
        <h2 style={{ color: 'var(--accent)' }}>VibeDev Stress Test: Phase 1</h2>
        <p>Active Bodies: {count}</p>
        <p>Frame Rate: <span style={{ color: fps > 55 ? '#0f0' : '#f00' }}>{fps} FPS</span></p>
        <button 
          onClick={() => setActive(!active)}
          style={{ padding: '8px 16px', background: 'var(--accent)', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 10 }}
        >
          Reset Rain
        </button>
      </div>

      <VibeProvider>
        <PhysicsProvider>
          <Floor />
          {drops.map(drop => (
            <RainDrop key={drop.id} {...drop} />
          ))}
        </PhysicsProvider>
      </VibeProvider>
    </div>
  );
};
