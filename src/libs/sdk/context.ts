import { createContext, useContext } from 'react';

interface SDKContext {
  /** carbon sdk exist in the webworker */
  isEnabled: boolean;
  /** data has been fetched */
  isInitialized: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const SdkContext = createContext<SDKContext>({
  isEnabled: false,
  isInitialized: false,
  isLoading: false,
  isError: false,
});
export const useCarbonInit = () => {
  return useContext(SdkContext);
};
