import { Dispatch, SetStateAction, useState } from 'react';

export interface SDKStore {
  isInitialized: boolean;
  setIsInitialized: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export const useSDKStore = (): SDKStore => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  return {
    isInitialized,
    setIsInitialized,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
  };
};

export const defaultSDKStore: SDKStore = {
  isInitialized: false,
  setIsInitialized: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isError: false,
  setIsError: () => {},
};
