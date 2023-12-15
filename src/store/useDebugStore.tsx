import { Dispatch, SetStateAction, useState } from 'react';

interface DebugState {
  showOverlapping: boolean;
}

export interface DebugStore {
  debugState: DebugState;
  setDebugState: Dispatch<SetStateAction<DebugState>>;
}

export const useDebugStore = (): DebugStore => {
  const [debugState, setDebugState] = useState<DebugState>({
    showOverlapping: false,
  });

  return {
    debugState,
    setDebugState,
  };
};

export const defaultDebugStore: DebugStore = {
  debugState: { showOverlapping: false },
  setDebugState: () => {},
};
