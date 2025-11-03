import { createContext, useContext } from 'react';

interface SDKContext {
  isInitialized: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const SdkContext = createContext<SDKContext>({
  isInitialized: false,
  isLoading: false,
  isError: false,
});
export const useCarbonInit = () => {
  return useContext(SdkContext);
};
