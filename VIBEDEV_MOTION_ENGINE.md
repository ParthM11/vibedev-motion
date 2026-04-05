# 🌀 VibeDev Motion Engine: The Definitive Technical Guide

VibeDev Motion is a dual-core interaction engine that combines the declarative power of **Framer Motion** with the high-performance rigid-body dynamics of **Rapier WASM**. This guide provides a deep technical dive into every hook, component, and utility within the library.

---

## 🏗️ Architecture & Core Mechanics

The engine operates on a "Sync-State" architecture. While Framer Motion handles the React state and visual transitions, the VibeDev core runs a parallel physics simulation in a WASM-based world.

### 1. The Physics Loop
The `PhysicsProvider` initializes a `RAPIER.World` and starts a `requestAnimationFrame` loop. Each frame:
- The world steps forward (`world.step(eventQueue)`).
- `useBody` hooks listen to the world transforms and update their respective React components.

### 2. Rigid-Body Syncing
Every `vibe` component can be linked to a physical body. If `physics={true}` is passed:
- A matching rigid body and collider are created in the simulation.
- The element's `x`, `y`, and `rotate` are driven by the simulation instead of standard CSS layouts.

---

## 🪝 Hooks Reference

### `useGravityUI(options)`
**What it does:** Calculates the vector between the cursor and the element's center to apply a magnetic "pull."
- **Internal Logic:** Uses a `useSpring` from Framer Motion. On `mousemove`, it calculates distance and normalizes the pull factor.
- **Detailed Use Case:** Creating "Sticky" buttons that feel magnetic. Perfect for high-end call-to-action buttons where the button physically gravitates toward the user's intent.

### `useAutoExperience(options)`
**What it does:** A "Zero-Config" DOM scanner that automatically attaches light-weight magnetic effects to specific selectors.
- **Internal Logic:** Attaches global event listeners to `window`. It calculates proximity for all elements matching the `selectors` (default: `button, a, .vibe-card`) and applies a `translate3d` transform.
- **Detailed Use Case:** Retrofitting an existing legacy site. Adding this at the root makes every link and button on the page feel bouncy and alive without modifying individual components.

### `useEnvironmentalLight(options)`
**What it does:** Treats the cursor as a point light source in 2D space.
- **Internal Logic:** Sets global CSS variables (`--vibe-light-x`, `--vibe-light-y`). For elements with the `.vibe-cast-shadow` class, it calculates the shadow offset relative to the cursor position to create dynamic perspective-based box shadows.
- **Detailed Use Case:** Dark-mode "flashlight" interfaces. Use it to make UI cards cast shadows that move away from the cursor, creating a deep 3D sensation.

### `usePhysicalDrag(body, options)`
**What it does:** Maps Framer Motion drag gestures to physical impulses.
- **Internal Logic:** On `onDrag`, it applies a continuous impulse to the Rapier body based on movement delta. On `onDragEnd`, it converts the drag velocity into a physical linear velocity (`setLinvel`).
- **Detailed Use Case:** A "Tossable" UI. Imagine a chat bubble that you can "flick" to dismiss; it will bounce off the screen edges before disappearing.

### `usePhysicalLayout(body, options)`
**What it does:** The engine's signature layout transition system using "Impulse-FLIP."
- **Internal Logic:** Captures `firstRect` and `lastRect`. Instead of a standard CSS transition, it converts the spatial delta into a **Physical Impulse** applied to the Rapier simulation. This enables elements to physically "bump" into others while moving to their new layout positions.
- **Detailed Use Case:** A "Solid" grid. When an item is removed, the remaining items physically drift into their new slots, with momentum and inertia based on the active theme.

---

## 🏗️ Components Reference

### `vibe` (Proxy Object)
The `vibe` object (e.g., `vibe.div`, `vibe.button`) is the primary entry point.
- **What it does:** It acts as a wrapper for `motion.element`. It automatically injects the `useGravityUI` bindings and handles the communication between the React DOM and the physics body.
- **Prop: `physics`:** Set to `true` for a dynamic rigid body, or `'fixed'` for a static collider that others can bounce off of.

### `AnimatePresence`
**What it does:** Extends Framer Motion's `AnimatePresence` with `physicsExit`.
- **Internal Logic:** When a child is removed, it keeps the element in the DOM and toggles a "shatter" or "eject" force on the physical body, causing the element to fall off-screen physically before being unmounted.
- **Detailed Use Case:** Deleting items from a list where the item literally falls down out of the list due to gravity.

### `Reorder`
**What it does:** A physics-enabled version of Framer Motion's Reorder.
- **Internal Logic:** Each `Item` is given a physical body with collision detection. When dragging one item, others aren't just moved via SVG/Transform; they are physically pushed aside by the collider of the dragged item.
- **Detailed Use Case:** A "Physical" task board where moving a card feels like moving a heavy object that displaces others.

### `VibeReveal`
**What it does:** A viewport-aware reveal component that respects current presets.
- **Internal Logic:** Uses `whileInView` to trigger entry animations. It pulls physics parameters (stiffness, damping) from the `VibeContext`.
- **Detailed Use Case:** Loading a landing page section where elements don't just fade in, but "pop" in with theme-specific physics (e.g., Cyber-neon glitches).

### `ScrollPhysics`
**What it does:** Translates scroll speed into global physical forces.
- **Internal Logic:** Uses `useVelocity` on the scroll position. It then iterates through all dynamic bodies in the `world` and applies an impulse proportional to the scroll velocity.
- **Detailed Use Case:** A "Liquid" page. As you scroll fast, the buttons on the page "tilt" or "shake" in response to the inertia of the scroll.

---

## 🎨 Design Presets (The "Vibe" System)

VibeDev uses a predefined physics catalog to create specific emotional responses:

| Preset | Technical profile | Best Use Case |
| :--- | :--- | :--- |
| **`apple`** | High damping (20+), medium stiffness (150). Focuses on silkiness. | High-end B2B, SaaS, or Portfolio sites. |
| **`cyber`** | Low damping (5), extreme stiffness (500). High-frequency oscillation. | Gaming sites, crypto dashboards, tech-heavy UIs. |
| **`minimal`** | Critical damping (exactly balanced). High mass (stays put). | Documentation, internal tools, clean minimal blogs. |
| **`glitch`** | Randomized drag coefficients. Periodic noise in spring values. | Digital art galleries, experimental personal sites. |

---

## 🚀 Professional Use Case: "The Kinetic Dashboard"

To create a state-of-the-art dashboard using the full engine:

1. **Setup**: Wrap the app in `<PhysicsProvider>` and `<VibeProvider theme="apple">`.
2. **Layout**: Use `<ScrollPhysics intensity={0.5} />` to make the widgets react to the page momentum.
3. **Widgets**: Build cards using `<vibe.div physics={true} drag />`.
4. **Interactions**: Apply `useEnvironmentalLight()` so that when the user hovers over the dashboard, "light" follows the cursor, casting shadows across the data widgets.
5. **Transitions**: Use `layout="physics"` and `layoutId` for shared element transitions. This ensures that when a modal opens or a sidebar collapses, the spatial shift is handled by the physics solver, transferring velocity from the old state to the new one.

---

## 🛠️ Internal Physics Specs

- **Gravity**: Default `(0, -9.81)` in simulation units.
- **Scale**: `1 simulation unit = 100 pixels`.
- **Friction**: Default `0.5`, **Restitution**: Default `0.7` (Provides a nice "bouncy" feel).
