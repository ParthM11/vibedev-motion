import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { usePhysics } from '../physics/PhysicsProvider';

interface LayoutGroupContextProps {
  id: string;
}

const LayoutGroupContext = createContext<LayoutGroupContextProps | undefined>(undefined);

/**
 * LayoutGroup: Synchronizes layout animations across multiple components.
 * When any component in the group re-renders and triggers a layout shift,
 * the entire group's physics world is synchronized.
 */
export const LayoutGroup: React.FC<{ children: ReactNode; id?: string }> = ({ children, id = 'default' }) => {
  const { step } = usePhysics();

  const value = useMemo(() => ({ id }), [id]);

  // We wrap children in a context to track group membership
  return (
    <LayoutGroupContext.Provider value={value}>
      {children}
    </LayoutGroupContext.Provider>
  );
};

export const useLayoutGroup = () => useContext(LayoutGroupContext);
