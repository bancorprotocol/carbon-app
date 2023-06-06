import { useTranslation } from 'libs/translations';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

export interface SDKStore {
  isInitialized: boolean;
  setIsInitialized: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export const useSDKStore = (): SDKStore => {
  const [_isInitialized, setIsInitialized] = useState(false);
  const { ready } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isInitialized = useMemo(() => {
    return _isInitialized && ready;
  }, [_isInitialized, ready]);

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
