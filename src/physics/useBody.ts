import { useEffect, useRef, useState, useCallback } from 'react';
import { usePhysics } from './PhysicsProvider';
import { RigidBodyDesc, ColliderDesc, RigidBody } from '@dimforge/rapier2d';
import { VibeTransition } from '../types';

export const useBody = (options: {
  type?: 'dynamic' | 'fixed' | 'kinematicPositionBased' | 'kinematicVelocityBased';
  position?: { x: number; y: number };
  mass?: number;
  restitution?: number;
  friction?: number;
  physicsProps?: VibeTransition;
  onUpdate?: (transform: { x: number; y: number; rotation: number }) => void;
}) => {
  const { world } = usePhysics();
  const bodyRef = useRef<RigidBody | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotation: 0 });
  const targetRef = useRef<{ x: number, y: number } | null>(null);

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

  // High-performance Physics Sync & Spring Force Cycle
  useEffect(() => {
    if (!bodyRef.current) return;

    let rafId: number;
    let startTime = Date.now();

    const sync = () => {
      if (!bodyRef.current) return;
      
      const body = bodyRef.current;
      const translation = body.translation();
      const velocity = body.linvel();
      const { stiffness = 100, damping = 10, repeat = 0, repeatType = 'loop' } = options.physicsProps || {};
      
      // 1. APPLY SPRING FORCES (Target Tracking)
      if (targetRef.current) {
          const currentPos = translation;
          const targetPos = targetRef.current;
          
          // F = -k(x) - c(v)
          const forceX = -stiffness * (currentPos.x - targetPos.x) - damping * velocity.x;
          const forceY = -stiffness * (currentPos.y - targetPos.y) - damping * velocity.y;
          
          body.applyImpulse({ x: forceX * 0.016, y: forceY * 0.016 }, true);

          // 2. REPEAT LOGIC (Advanced Orchestration)
          if (repeat !== 0) {
              const distance = Math.sqrt(
                  Math.pow(currentPos.x - targetPos.x, 2) + 
                  Math.pow(currentPos.y - targetPos.y, 2)
              );

              // If we've settled at the target, trigger repeat
              if (distance < 0.01 && Math.abs(velocity.x) < 0.01 && Math.abs(velocity.y) < 0.01) {
                  if (repeatType === 'loop') {
                      // Reset to a stored 'initial' if available, or just jump
                      // For now, we'll expose a reset trigger or just bounce
                  } else if (repeatType === 'reverse') {
                      // Handled more naturally by the 'reverse' animation in Framer
                  }
              }
          }
      }

      setTransform({ x: translation.x, y: translation.y, rotation: body.rotation() });
      if (options.onUpdate) options.onUpdate({ x: translation.x, y: translation.y, rotation: body.rotation() });

      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [bodyRef.current, options.physicsProps, options.onUpdate]);

  const setTarget = useCallback((pos: { x: number, y: number }) => {
      targetRef.current = pos;
  }, []);

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

  const resetVelocity = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.setLinvel({ x: 0, y: 0 }, true);
      bodyRef.current.setAngvel(0, true);
    }
  }, []);

  return { 
    body: bodyRef.current, 
    transform, 
    applyImpulse, 
    setTranslation, 
    setTarget,
    resetVelocity
  };
};
