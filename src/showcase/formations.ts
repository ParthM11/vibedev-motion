/**
 * Coordinate generators for The Kinetic Constellation formations.
 */
export type Formation = 'grid' | 'vortex' | 'wave' | 'synthron' | 'chaos';

export interface Point {
  x: number;
  y: number;
}

export function getGridFormation(count: number, width: number, height: number): Point[] {
  const cols = Math.ceil(Math.sqrt(count * (width / height)));
  const rows = Math.ceil(count / cols);
  
  const stepX = width / cols;
  const stepY = height / rows;
  
  return Array.from({ length: count }).map((_, i) => ({
    x: (i % cols) * stepX - width / 2 + stepX / 2,
    y: Math.floor(i / cols) * stepY - height / 2 + stepY / 2
  }));
}

export function getVortexFormation(count: number, radius: number): Point[] {
  return Array.from({ length: count }).map((_, i) => {
    const angle = 0.5 * i; // Spiral coefficient
    const r = (radius / count) * i;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r
    };
  });
}

export function getWaveFormation(count: number, width: number, amplitude: number): Point[] {
  const stepX = width / count;
  return Array.from({ length: count }).map((_, i) => {
    const x = i * stepX - width / 2;
    return {
      x,
      y: Math.sin(i * 0.1) * amplitude
    };
  });
}

export function getSynthronFormation(count: number, size: number): Point[] {
  // A stylized 'S' or high-end geometric shape for the logo
  return Array.from({ length: count }).map((_, i) => {
    const t = (i / count) * Math.PI * 2;
    // Lemniscate of Bernoulli (Infinity-like shape for Synthron)
    const scale = size / (Math.sin(t) * Math.sin(t) + 1);
    return {
      x: scale * Math.cos(t),
      y: scale * Math.sin(2 * t) / 2
    };
  });
}
