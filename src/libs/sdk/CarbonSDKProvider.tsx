import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { sdk } from 'libs/sdk/carbonSdk';

interface CarbonSDKContext {
  isInitialized: boolean;
  isLoading: boolean;
  isError: boolean;
}

const defaultValue: CarbonSDKContext = {
  isInitialized: false,
  isLoading: false,
  isError: false,
};

const CarbonSdkCTX = createContext<CarbonSDKContext>(defaultValue);

export const CarbonSDKProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const init = async () => {
    try {
      setIsLoading(true);
      await sdk.startDataSync();
      setIsInitialized(true);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    void init();
  }, []);

  return (
    <CarbonSdkCTX.Provider value={{ isInitialized, isLoading, isError }}>
      {children}
    </CarbonSdkCTX.Provider>
  );
};

export const useCarbonSDK = () => {
  return useContext(CarbonSdkCTX);
};
