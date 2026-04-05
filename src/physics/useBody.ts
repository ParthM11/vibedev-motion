import { useEffect, useRef, useState, useCallback } from 'react';
import { usePhysics } from './PhysicsProvider';
import { RigidBodyDesc, ColliderDesc, RigidBody } from '@dimforge/rapier2d';

export const useBody = (options: {
  type?: 'dynamic' | 'fixed' | 'kinematicPositionBased' | 'kinematicVelocityBased';
  position?: { x: number; y: number };
  mass?: number;
  restitution?: number;
  friction?: number;
}) => {
  const { world } = usePhysics();
  const bodyRef = useRef<RigidBody | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotation: 0 });

  useEffect(() => {
    if (!world) return;

    // Create a rigid body
    let bodyDesc;
    switch (options.type) {
      case 'fixed':
        bodyDesc = RigidBodyDesc.fixed();
        break;
      case 'kinematicPositionBased':
        bodyDesc = RigidBodyDesc.kinematicPositionBased();
        break;
      case 'kinematicVelocityBased':
        bodyDesc = RigidBodyDesc.kinematicVelocityBased();
        break;
      default:
        bodyDesc = RigidBodyDesc.dynamic();
    }
    
    if (options.position) {
      bodyDesc.setTranslation(options.position.x, options.position.y);
    }

    const body = world.createRigidBody(bodyDesc);
    
    // Initial collider (box)
    const colliderDesc = ColliderDesc.cuboid(0.5, 0.5)
      .setRestitution(options.restitution ?? 0.5)
      .setFriction(options.friction ?? 0.5);
    
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
      if (!bodyRef.current) return;
      const translation = bodyRef.current.translation();
      const rotation = bodyRef.current.rotation();
      setTransform({ x: translation.x, y: translation.y, rotation });
    };

    // Use a high-frequency sync for physics-driven UI
    const interval = setInterval(sync, 16); 
    return () => clearInterval(interval);
  }, [bodyRef.current]);

  const applyImpulse = useCallback((impulse: { x: number; y: number }, wakeUp = true) => {
    if (bodyRef.current) {
      bodyRef.current.applyImpulse(impulse, wakeUp);
    }
  }, []);

  const setTranslation = useCallback((translation: { x: number; y: number }, wakeUp = true) => {
    if (bodyRef.current) {
      bodyRef.current.setTranslation(translation, wakeUp);
    }
  }, []);

  return { 
    body: bodyRef.current, 
    transform, 
    applyImpulse, 
    setTranslation 
  };
};
