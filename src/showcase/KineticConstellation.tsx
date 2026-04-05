import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { vibe, VibeProvider, PhysicsProvider, useGravityUI } from '../index';
import { getGridFormation, getVortexFormation, getWaveFormation, getSynthronFormation, Formation, Point } from './formations';
import './showcase.css';

const Particle = ({ target, id }: { target: Point; id: number }) => {
  return (
    <vibe.div
      physics="dynamic"
      transition={{ 
        type: 'spring', 
        visualDuration: 0.8 + Math.random() * 0.4, 
        bounce: 0.2 + Math.random() * 0.2 
      }}
      style={{
        width: 12,
        height: 12,
        background: 'rgba(0, 255, 204, 0.15)',
        border: '1px solid rgba(0, 255, 204, 0.3)',
        borderRadius: '50%',
        padding: 0,
        margin: 0,
        backdropFilter: 'blur(4px)',
        position: 'absolute',
        left: '50%',
        top: '50%',
      }}
      // This maps the particle to its formation target
      animate={{ x: target.x, y: target.y }}
    />
  );
};

export const KineticConstellation = () => {
  const [formation, setFormation] = useState<Formation>('grid');
  const [count] = useState(500); // 500 PHYSICAL BODIES
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Corrected Props: strength and range
  const { bind } = useGravityUI({ strength: 5, range: 150 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, []);

  const targets = useMemo(() => {
    const { width, height } = dimensions;
    switch (formation) {
      case 'vortex': return getVortexFormation(count, Math.min(width, height) * 0.4);
      case 'wave': return getWaveFormation(count, width * 0.8, height * 0.2);
      case 'synthron': return getSynthronFormation(count, Math.min(width, height) * 0.35);
      case 'grid':
      default: return getGridFormation(count, width * 0.7, height * 0.7);
    }
  }, [formation, count, dimensions]);

  // Combined Ref for motion.div
  const combinedRef = (node: HTMLDivElement | null) => {
      (containerRef as any).current = node;
      bind.ref(node);
  };

  return (
    <motion.div 
        className="showcase-container" 
        {...bind} 
        ref={combinedRef}
    >
      <div className="showcase-controls">
        <button 
          className={formation === 'grid' ? 'active' : ''} 
          onClick={() => setFormation('grid')}
        >
          Physical Grid
        </button>
        <button 
          className={formation === 'vortex' ? 'active' : ''} 
          onClick={() => setFormation('vortex')}
        >
          Kinetic Vortex
        </button>
        <button 
          className={formation === 'wave' ? 'active' : ''} 
          onClick={() => setFormation('wave')}
        >
          Oscillator Wave
        </button>
        <button 
          className={formation === 'synthron' ? 'active' : ''} 
          onClick={() => setFormation('synthron')}
        >
          Synthron Logo
        </button>
      </div>

      <VibeProvider transition={{ type: 'spring', visualDuration: 0.6, bounce: 0.2 }}>
        <PhysicsProvider>
          {targets.map((target, i) => (
            <Particle key={i} target={target} id={i} />
          ))}
        </PhysicsProvider>
      </VibeProvider>

      <div className="showcase-stats">
        <p>ACTIVE BODIES: {count}</p>
        <p>SIMULATION: 60Hz / DOUBLE-CORE SYNC</p>
        <p>TECH: Impulse-FLIP + WASM RAPIER</p>
      </div>
    </motion.div>
  );
};
