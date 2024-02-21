import { Dispatch, SetStateAction, useState } from 'react';

export interface DebugState {
  isE2E: boolean;
}

export interface DebugStore {
  debugState: DebugState;
  setDebugState: Dispatch<SetStateAction<DebugState>>;
}

export const useDebugStore = (): DebugStore => {
  // Keep this alive for future need
  const [debugState, setDebugState] = useState<DebugState>({
    isE2E: false,
  });

  return {
    debugState,
    setDebugState,
  };
};

export const defaultDebugStore: DebugStore = {
  debugState: { isE2E: false },
  setDebugState: () => {},
};
