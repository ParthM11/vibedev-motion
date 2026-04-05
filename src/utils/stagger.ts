/**
 * A utility to create staggered delays for children animations.
 * Mirrors Framer Motion's stagger() function for developer familiarity.
 */
export function stagger(
  duration: number = 0.1,
  options: { startDelay?: number; from?: 'first' | 'last' | 'center' | number } = {}
) {
  const { startDelay = 0, from = 'first' } = options;

  return (index: number, total: number) => {
    let delay = index * duration;

    if (from === 'last') {
      delay = (total - 1 - index) * duration;
    } else if (from === 'center') {
      const center = (total - 1) / 2;
      delay = Math.abs(index - center) * duration;
    } else if (typeof from === 'number') {
      delay = Math.abs(index - from) * duration;
    }

    return startDelay + delay;
  };
}
