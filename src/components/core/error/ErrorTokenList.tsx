import { MainError } from './ErrorSDKStartSync';

export const ErrorTokenList = () => {
  return (
    <MainError
      title="Network Error"
      description="Failed to fetch token list. Please check your network connection and try again."
    />
  );
};
