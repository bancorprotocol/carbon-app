import { Dispatch, SetStateAction, useState } from 'react';

export interface DebugState {}

export interface DebugStore {
  debugState: DebugState;
  setDebugState: Dispatch<SetStateAction<DebugState>>;
}

export const useDebugStore = (): DebugStore => {
  // Keep this alive for future need
  const [debugState, setDebugState] = useState<DebugState>({});

  return {
    debugState,
    setDebugState,
  };
};

export const defaultDebugStore: DebugStore = {
  debugState: { showOverlapping: false },
  setDebugState: () => {},
};
