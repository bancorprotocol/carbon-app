import { FC, useEffect, useRef } from 'react';
import { Outlet, PathNames, useLocation } from 'libs/routing';
import { ErrorUnsupportedNetwork } from 'components/core/error/ErrorUnsupportedNetwork';
import { ErrorNetworkConnection } from 'components/core/error/ErrorNetworkConnection';
import { useTokens } from 'hooks/useTokens';
import { ErrorTokenList } from 'components/core/error/ErrorTokenList';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { ErrorSDKStartSync } from 'components/core/error/ErrorSDKStartSync';
import { carbonEvents } from 'services/events';
import { ErrorUserBlocked } from 'components/core/error/ErrorUserBlocked';
import { useAccount, useBlockNumber, useNetwork } from 'wagmi';
import { isAccountBlocked } from 'utils/restrictedAccounts';

export const MainContent: FC = () => {
  const { address: user } = useAccount();
  const { chain } = useNetwork();
  const { error: networkError } = useBlockNumber();
  const location = useLocation();
  const prevPathnameRef = useRef('');
  const tokens = useTokens();
  const sdk = useCarbonInit();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
    });
  }, [location.current]);

  useEffect(() => {
    if (prevPathnameRef.current !== location.current.pathname) {
      carbonEvents.general.changePage({ referrer: prevPathnameRef.current });

      prevPathnameRef.current = location.current.pathname;
    }
  }, [location, location.current.pathname]);

  if (
    location.current.pathname === PathNames.debug ||
    location.current.pathname === PathNames.terms ||
    location.current.pathname === PathNames.privacy
  ) {
    return <Outlet />;
  }

  if (chain?.unsupported) {
    return <ErrorUnsupportedNetwork />;
  }

  if (networkError) {
    return <ErrorNetworkConnection />;
  }

  if (sdk.isError) {
    return <ErrorSDKStartSync />;
  }

  if (tokens.isError) {
    return <ErrorTokenList />;
  }

  if (isAccountBlocked(user)) {
    return <ErrorUserBlocked />;
  }

  return <Outlet />;
};
