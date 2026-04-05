import React, { useState, useEffect } from 'react';
import { vibe, VibeProvider, PhysicsProvider, usePhysics } from '../index';

/**
 * Audit: Internal World State Monitor
 */
const WorldStateMonitor = ({ onUpdate }: { onUpdate: (count: number) => void }) => {
  const { world } = usePhysics();
  
  useEffect(() => {
    const id = setInterval(() => {
      if (world) {
        onUpdate(world.bodies.len());
      }
    }, 100);
    return () => clearInterval(id);
  }, [world]);

  return null;
};

/**
 * LeakTest: Mount Cycle Stress
 * 
 * Repeatedly mounts and unmounts 100 bodies to ensure zero WASM memory leaks.
 * If the body count returns to zero after each cycle, the cleanup is healthy.
 */
export const LeakTest = () => {
  const [mounted, setMounted] = useState(true);
  const [bodyCount, setBodyCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMounted(prev => !prev);
      setCycleCount(c => c + 1);
    }, 2000); // 2 Seconds per cycle
    return () => clearInterval(id);
  }, []);

  return (
    <VibeProvider>
      <PhysicsProvider>
        <div style={{ padding: 40, color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2 style={{ color: 'var(--accent)' }}>VibeDev Memory Audit: Phase 2</h2>
          <div style={{ margin: '20px 0', padding: 20, border: '1px solid var(--accent)', borderRadius: 12 }}>
            <p>Cycle Count: {cycleCount}</p>
            <p>Current Mounting State: <span style={{ color: mounted ? '#0f0' : '#f00' }}>{mounted ? 'MOUNTED' : 'UNMOUNTED'}</span></p>
            <p>WASM Virtual Bodies: <span style={{ fontWeight: 'bold' }}>{bodyCount}</span></p>
            <p style={{ color: bodyCount === 0 && !mounted ? '#0f0' : (mounted ? '#fff' : '#f00') }}>
              Status: {bodyCount === 0 && !mounted ? '✅ CLEANUP SUCCESSFUL' : (mounted ? 'RUNNING...' : '⚠️ LEAK DETECTED')}
            </p>
          </div>

          <WorldStateMonitor onUpdate={setBodyCount} />

          {mounted && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10 }}>
              {Array.from({ length: 100 }).map((_, i) => (
                <vibe.div 
                  key={i} 
                  physics={true}
                  style={{ width: 20, height: 20, background: 'var(--accent)' }} 
                />
              ))}
            </div>
          )}
        </div>
      </PhysicsProvider>
    </VibeProvider>
  );
};
