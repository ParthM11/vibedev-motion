# 🌀 VibeDev Motion Engine: The Definitive Guide

Welcome to **VibeDev Motion**, a "crazy-level" interaction engine that bridges the gap between traditional UI animations and high-performance physical simulations. Built on top of **Framer Motion** and powered by a **Rapier WASM** physics core, this library enables you to create interfaces that don't just "move"—they **vibe**.

---

## 🚀 Key Features

- **WASM-Powered Physics**: Real-time collision detection and rigid-body dynamics using the Rapier physics engine.
- **Interactive Attraction**: "Gravity" hooks that make UI elements react dynamically to cursor movement.
- **Environmental Lighting**: A unique lighting system where the cursor acts as a light source, casting dynamic shadows.
- **Physics-Aware Layouts**: Fluid, physics-driven transitions for layout changes using the FLIP technique.
- **Zero-Config Presets**: Hand-crafted physics and color themes inspired by top-tier design systems.

---

## 🏗️ Core Components

### `vibe` (The Motion Proxy)
The `vibe` object is a drop-in replacement for Framer Motion's `motion`. It provides a physics-enhanced version of every standard HTML element.

**Usage:**
```tsx
import { vibe } from 'vibedev';

// Use vibe.div instead of motion.div for built-in physics
<vibe.div 
  physics={true} // Enables rigid-body physics
  drag 
  whileHover={{ scale: 1.05 }}
>
  I have a physical presence!
</vibe.div>
```

### `AnimatePresence`
A specialized version of Framer Motion's `AnimatePresence` that supports `physicsExit`. When an element exits, it can be subjected to physical forces (like shattering or flying away).

**Usage:**
```tsx
<AnimatePresence physicsExit>
  {isVisible && <vibe.div key="item">I'll fly away physically!</vibe.div>}
</AnimatePresence>
```

### `Reorder`
Physical list reordering. Items in a `Reorder` group will physically push each other aside using collisions, creating a tangible sense of weight and space.

---

## 🪝 Advanced Interaction

### `usePhysicalDrag`
A hook that translates standard drag gestures into physical impulses. Elements have mass, inertia, and will bounce off obstacles when "flicked."

### `ScrollPhysics`
A utility component that applies global physical forces based on the user's scroll speed and direction. Elements can "react" to the momentum of the page.

### `SVGPhysics`
Turns SVG paths into active physical objects. Imagine an SVG `<path>` that behaves like a physical rope or a string that reacts to touch.

---

## 🎨 Design Presets

VibeDev comes with four distinct personality-driven presets:

| Preset | Physics Profile | Aesthetic |
| :--- | :--- | :--- |
| `apple` | Silky & Controlled | Premium, minimalist light mode. |
| `cyber` | High-Tension & Snappy | Vibrant greens, neon blues, fast response. |
| `minimal` | Dampened & Subtle | Grey-scale, professional, low-energy. |
| `glitch` | High-Frequency & Chaotic | Pink/Magento, rapid oscillations, high-energy. |

---

## 🛠️ Use Cases

### 1. High-Fidelity "Flick" Interactions
Use `vibe.div` with `drag` to create cards that feel like they have real mass. Users can flick them across the screen, and they will settle with realistic momentum.

### 2. Kinetic List Sorting
Use `Reorder` for dashboards where moving a widget feels physical. The other widgets won't just move; they will be "pushed" by the one being dragged.

### 3. Environmental UI
Use `ScrollPhysics` to make elements on the page "shake" or "tilt" slightly as the user scrolls rapidly, giving the UI a sense of physical connection to the input.

---

## 📚 Getting Started

1. **Wrap your app** with `PhysicsProvider` and `VibeProvider`.
2. **Import `vibe`** for your components.
3. **Go Crazy**: Mix and match `physics`, `drag`, and `AnimatePresence` for state-of-the-art experiences.

```tsx
import { PhysicsProvider, VibeProvider, vibe, AnimatePresence } from 'vibedev';

export default function App() {
  return (
    <PhysicsProvider>
      <VibeProvider theme="cyber">
        <AnimatePresence physicsExit>
           <vibe.button drag>Click Me</vibe.button>
        </AnimatePresence>
      </VibeProvider>
    </PhysicsProvider>
  );
}
```
