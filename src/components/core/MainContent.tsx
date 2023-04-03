import { FC } from 'react';
import { useWeb3 } from 'libs/web3';
import { Outlet, PathNames, useLocation } from 'libs/routing';
import { ErrorUnsupportedNetwork } from 'components/core/error/ErrorUnsupportedNetwork';
import { ErrorNetworkConnection } from 'components/core/error/ErrorNetworkConnection';
import { useTokens } from 'hooks/useTokens';
import { ErrorTokenList } from 'components/core/error/ErrorTokenList';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { ErrorSDKStartSync } from 'components/core/error/ErrorSDKStartSync';
import { ErrorUserBlocked } from 'components/core/error/ErrorUserBlocked';

export const MainContent: FC = () => {
  const web3 = useWeb3();
  const {
    current: { pathname },
  } = useLocation();
  const tokens = useTokens();
  const sdk = useCarbonSDK();

  if (pathname === PathNames.debug) {
    return <Outlet />;
  }

  if (!web3.isSupportedNetwork) {
    return <ErrorUnsupportedNetwork />;
  }

  if (web3.networkError) {
    return <ErrorNetworkConnection />;
  }

  if (sdk.isError) {
    return <ErrorSDKStartSync />;
  }

  if (tokens.isError) {
    return <ErrorTokenList />;
  }

  if (web3.isUserBlocked) {
    return <ErrorUserBlocked />;
  }

  return <Outlet />;
};
