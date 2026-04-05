# 🌀 VibeDev Motion

> **The Definitive Dual-Core Interaction Engine for React.**  
> *Bridging the gap between declarative UI orchestration and high-performance rigid-body dynamics.*

[![Version](https://img.shields.io/npm/v/vibedev-motion?color=7e22ce&style=flat-square)](https://www.npmjs.com/package/vibedev-motion)
[![License](https://img.shields.io/github/license/ParthM11/vibedev-motion?style=flat-square)](https://github.com/ParthM11/vibedev-motion/blob/main/LICENSE)

VibeDev Motion isn't just an animation library; it's a **Kinetic UI Operating System**. By running a parallel, WASM-driven physics simulation alongside the React render cycle, it transforms static layouts into tactile, momentum-aware entities.

```bash
npm install vibedev-motion @dimforge/rapier2d framer-motion
```

---

## 🏗️ The Dual-Core Architecture

VibeDev Motion operates on a proprietary **Sim-Sync** layer, decoupling visual state from physical simulation:

1.  **Logical Core (Rapier WASM)**: A 60Hz rigid-body simulation world that calculates impulses, collisions, and angular momentum with sub-pixel precision.
2.  **Visual Core (React & Framer Motion)**: Handles high-level orchestration, layout projection, and accessibility.

The **Vibe Proxy** (`vibe`) acts as a high-speed bridge, mapping physical world transforms directly onto React components via hardware-accelerated CSS transforms.

---

## 💎 Signature Technology: Impulse-FLIP

Traditional layout animations use linear interpolation (FLIP). VibeDev Motion replaces this with **Physical Simulation**. 

When an element's layout changes, the engine calculates the spatial delta and applies a **Physical Impulse** to the body. This allows elements to physically "bump" into their neighbors while moving to new positions.

```tsx
import { vibe } from 'vibedev-motion';

const KineticCard = () => (
  <vibe.div 
    layout="physics" 
    layoutId="shared-card"
    restitution={0.8}
    friction={0.2}
  >
    {/* Content that reacts to momentum */}
  </vibe.div>
);
```

---

## 🌊 Kinetic Experience Hooks

Elevate your user experience with hooks that bridge the gap between input and physics.

### `useGravityUI(options)`
Creates a magnetic "pull" between the cursor and UI elements. Perfect for high-end call-to-action buttons that physically gravitate toward user intent.

### `useEnvironmentalLight(options)`
Treats the cursor as a point light source in 2D space. Elements cast dynamic, perspective-based shadows that move and scale relative to the cursor position.

### `useAutoExperience(selectors)`
A zero-config DOM scanner that automatically attaches lightweight magnetic effects to existing selectors (e.g., `button`, `a`). Retrofit legacy sites in seconds.

---

## 🎨 The "Vibe" System (Presets)

VibeDev uses a predefined physics catalog to create specific emotional responses:

| Preset | Technical Profile | Emotional Impact |
| :--- | :--- | :--- |
| **`apple`** | High damping, medium stiffness. | Silky, premium, and intentional. |
| **`cyber`** | Low damping, extreme stiffness. | High-frequency, aggressive, and tech-heavy. |
| **`minimal`** | Critical damping, high mass. | Stable, clean, and unobtrusive. |
| **`glitch`** | Randomized drag, periodic spring noise. | Experimental, digital art, and chaotic. |

---

## 🚀 Advanced Components

- **`<ScrollPhysics />`**: Translates scroll velocity into global physical forces. Fast scrolling "shakes" or "tilts" elements based on their inertia.
- **`<AnimatePresence />`**: Extends standard exit animations with `physicsExit`, causing elements to literally fall out of the layout due to gravity before unmounting.
- **`<Reorder />`**: A physics-enabled reordering system where items physically displace each other using rigid-body colliders.

---

## 🛠️ Performance Specs

- **Simulation Frequency**: 60Hz (Synchronized with `requestAnimationFrame`).
- **Internal Units**: 1 simulation unit = 100 pixels.
- **Memory**: Minimal overhead via shared WASM buffers.

---

## 🧪 Documentation & Deep Dive

For live interactive demos and comprehensive API references, visit the **[Official Documentation Portal](https://vibedev.synthron.in/)**. 

Detailed technical specifications and internal logic can also be found in the [VibeDev Motion Engine Guide](./VIBEDEV_MOTION_ENGINE.md).

---

MIT © [Synthron AI Technologies](https://synthron.in/) | Built for the next generation of the web.
