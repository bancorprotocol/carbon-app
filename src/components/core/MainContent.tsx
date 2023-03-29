import { FC, useEffect, useRef } from 'react';
import { useWeb3 } from 'libs/web3';
import { Outlet, PathNames, useLocation } from 'libs/routing';
import { ErrorUnsupportedNetwork } from 'components/core/error/ErrorUnsupportedNetwork';
import { ErrorNetworkConnection } from 'components/core/error/ErrorNetworkConnection';
import { useTokens } from 'hooks/useTokens';
import { ErrorTokenList } from 'components/core/error/ErrorTokenList';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { ErrorSDKStartSync } from 'components/core/error/ErrorSDKStartSync';
import { sendEvent } from 'services/googleTagManager';

export const MainContent: FC = () => {
  const web3 = useWeb3();
  const location = useLocation();
  const prevPathnameRef = useRef('');
  const tokens = useTokens();
  const sdk = useCarbonSDK();

  useEffect(() => {
    if (prevPathnameRef.current !== location.current.pathname) {
      sendEvent('general', 'change_page', {
        from: prevPathnameRef.current ? prevPathnameRef.current : null,
        to: location.current.pathname,
      });
      prevPathnameRef.current = location.current.pathname;
    }
  }, [location, location.current.pathname]);

  if (location.current.pathname === PathNames.debug) {
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

  return <Outlet />;
};
