import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as RAPIER from '@dimforge/rapier2d';

interface PhysicsContextProps {
  world: RAPIER.World | null;
  step: () => void;
}

const PhysicsContext = createContext<PhysicsContextProps | null>(null);

export const PhysicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [world, setWorld] = useState<RAPIER.World | null>(null);
  const eventQueue = useRef<RAPIER.EventQueue | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    import('@dimforge/rapier2d').then((RAPIER: any) => {
      const initFunc = RAPIER.default || RAPIER.init;
      if (initFunc) {
        initFunc().then(() => {
          eventQueue.current = new RAPIER.EventQueue(true);
          const gravity = { x: 0.0, y: -9.81 };
          const newWorld = new RAPIER.World(gravity);
          setWorld(newWorld);
        });
      }
    });

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const step = () => {
    if (world && eventQueue.current) {
      world.step(eventQueue.current);
    }
  };

  // Main physics loop
  const animate = () => {
    step();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (world) {
      animate();
    }
  }, [world]);

  return (
    <PhysicsContext.Provider value={{ world, step }}>
      {children}
    </PhysicsContext.Provider>
  );
};

export const usePhysics = () => {
  const context = useContext(PhysicsContext);
  if (!context) throw new Error('usePhysics must be used within a PhysicsProvider');
  return context;
};
