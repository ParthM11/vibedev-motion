import React, { useEffect, useRef, useState } from 'react';
import { usePhysics } from '../physics/PhysicsProvider';
import * as RAPIER from '@dimforge/rapier2d';

/**
 * SVGPhysics: A specialized component that turns an SVG path into
 * a series of physical segments (rope-like).
 */
export const SVGPhysics: React.FC<{
  path: string;
  segmentCount?: number;
  physics?: boolean;
  intensity?: number;
  gravity?: number;
  onUpdate?: (points: { x: number, y: number }[]) => void;
}> = ({ path, segmentCount = 12, physics = true, intensity = 1.0, gravity = 1, onUpdate }) => {
  const { world } = usePhysics();
  const [bodies, setBodies] = useState<RAPIER.RigidBody[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!world || !physics) return;

    // 1. Simple path parsing (for demonstration, we assume a line or simple curve)
    // In a production scenario, we'd use 'svg-path-properties' or similar.
    const segments: RAPIER.RigidBody[] = [];
    const step = 100 / segmentCount;

    for (let i = 0; i <= segmentCount; i++) {
        const isFirst = i === 0;
        const type = isFirst ? RAPIER.RigidBodyType.Fixed : RAPIER.RigidBodyType.Dynamic;
        
        const bodyDesc = new RAPIER.RigidBodyDesc(type)
            .setTranslation(i * step * 0.1, -i * 0.05)
            .setLinearDamping(0.5)
            .setAngularDamping(0.5);
            
        const body = world.createRigidBody(bodyDesc);
        
        const colliderDesc = RAPIER.ColliderDesc.ball(0.1)
            .setRestitution(0.5)
            .setFriction(0.5);
        world.createCollider(colliderDesc, body);
        
        segments.push(body);

        // Connect to previous segment
        if (i > 0) {
            const prevBody = segments[i - 1];
            const params = RAPIER.JointData.revolute({ x: 0, y: 0 }, { x: -step * 0.1, y: 0.05 });
            world.createImpulseJoint(params, prevBody, body, true);
        }
    }

    setBodies(segments);

    return () => {
      segments.forEach((body) => world.removeRigidBody(body));
    };
  }, [world, physics, segmentCount]);

  // Sync physics to visual points
  useEffect(() => {
    if (!bodies.length || !onUpdate) return;

    const sync = () => {
        const points = bodies.map(b => {
            const t = b.translation();
            return { x: t.x * 100, y: -t.y * 100 }; // Convert back to SVG space
        });
        onUpdate(points);
        frameRef.current = requestAnimationFrame(sync);
    };

    sync();
    return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [bodies, onUpdate]);

  return null; // Logic-only component
};
