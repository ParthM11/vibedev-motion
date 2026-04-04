import { useEffect, useRef, useState } from 'react';
import { usePhysics } from './PhysicsProvider';
import { RigidBodyDesc, ColliderDesc } from '@dimforge/rapier2d';

export const useBody = (options: {
  type?: 'dynamic' | 'fixed' | 'kinematicPositionBased' | 'kinematicVelocityBased';
  position?: { x: number; y: number };
  mass?: number;
}) => {
  const { world } = usePhysics();
  const bodyRef = useRef<any>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotation: 0 });

  useEffect(() => {
    if (!world) return;

    // Create a rigid body
    const bodyDesc = options.type === 'fixed' 
      ? RigidBodyDesc.fixed() 
      : RigidBodyDesc.dynamic();
    
    if (options.position) {
      bodyDesc.setTranslation(options.position.x, options.position.y);
    }

    const body = world.createRigidBody(bodyDesc);
    
    // Initial collider (box)
    const colliderDesc = ColliderDesc.cuboid(0.5, 0.5);
    world.createCollider(colliderDesc, body);

    bodyRef.current = body;

    return () => {
      world.removeRigidBody(body);
    };
  }, [world, options.type]);

  // Sync physics body to React state
  useEffect(() => {
    if (!bodyRef.current) return;

    const sync = () => {
      const translation = bodyRef.current.translation();
      const rotation = bodyRef.current.rotation();
      setTransform({ x: translation.x, y: translation.y, rotation });
    };

    const interval = setInterval(sync, 16); // ~60fps sync
    return () => clearInterval(interval);
  }, [bodyRef.current]);

  return { body: bodyRef.current, transform };
};
