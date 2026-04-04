# 🌌 VibeDev Motion

> **The "Anti-Gravity" UI Engine for Next-Gen React Apps.**

VibeDev Motion is a high-performance, physics-driven interaction library that brings **life** to your digital interfaces. It eliminates static, boring UIs by introducing magnetic fields, inertia-based movement, and automated UX enchantment.

[![NPM Version](https://img.shields.io/npm/v/vibedev-motion?color=blue&style=flat-square)](https://www.npmjs.com/package/vibedev-motion)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## ⚡ Quick Start

```bash
npm install vibedev-motion framer-motion
```

---

## 🌌 `useGravityUI()`

Transform any element into a magnetic object that attracts the cursor with smooth, spring-based physics.

```tsx
import { useGravityUI } from 'vibedev-motion';

function MyComponent() {
  const { bind } = useGravityUI({ 
    strength: 0.5, 
    range: 250,
    stiffness: 200 
  });

  return (
    <div {...bind} className="magnetic-button">
      Hover near me!
    </div>
  );
}
```

### Options
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `strength` | `number` | `0.4` | How strongly the element pulls towards the cursor. |
| `range` | `number` | `200` | The radius (px) of the magnetic field. |
| `stiffness`| `number` | `150` | Spring stiffness. |
| `damping` | `number` | `15` | Spring damping. |

---

## 🤯 `useAutoExperience()`

The "Zero-Config" UI Enhancer. Drop this hook at the root of your app to automatically detect buttons, links, and cards, and apply premium hover effects and magnetic micro-interactions.

```tsx
import { useAutoExperience } from 'vibedev-motion';

function App() {
  // Scans DOM and applies physics-driven patterns automatically
  useAutoExperience({
    selectors: ['button', 'a', '.card'],
    intensity: 20
  });

  return (
    <main>
      <button>I am automatically magnetic!</button>
      <a href="#">So am I!</a>
    </main>
  );
}
```

---

## 🚀 Why VibeDev?

- **Physics-First**: Built on top of `framer-motion` for buttery smooth 60fps animations.
- **Micro-Interactions**: Adds the "Apple-level" polish to your apps with zero effort.
- **Lightweight**: Optimized for tree-shaking and minimal bundle impact.
- **Universal**: Works with Vite, Next.js, and any React framework.

---

## 🛠️ Contributing

We welcome contributions! If you have ideas for new physics-driven hooks or UX patterns, open an issue or PR.

---

## 📜 License

MIT © [VibeDev](https://github.com/vibedev-lib)
