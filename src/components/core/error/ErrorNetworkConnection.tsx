import { MainError } from './ErrorSDKStartSync';

export const ErrorNetworkConnection = () => {
  return (
    <MainError
      title="Network Error"
      description="Failed to establish RPC connection. Please check your network connection and try again."
    />
  );
};
