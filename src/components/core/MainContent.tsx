import { FC, useEffect, useRef } from 'react';
import { useWeb3 } from 'libs/web3';
import { ErrorUnsupportedNetwork } from 'components/core/error/ErrorUnsupportedNetwork';
import { ErrorNetworkConnection } from 'components/core/error/ErrorNetworkConnection';
import { useTokens } from 'hooks/useTokens';
import { ErrorTokenList } from 'components/core/error/ErrorTokenList';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { ErrorSDKStartSync } from 'components/core/error/ErrorSDKStartSync';
import { carbonEvents } from 'services/events';
import { ErrorUserBlocked } from 'components/core/error/ErrorUserBlocked';
import {
  Outlet,
  Pathnames,
  useRouterState,
  useScrollRestoration,
} from 'libs/routing';
import { useActivityNotifications } from 'components/activity/useActivityNotifiction';

const paths: Record<string, Pathnames> = {
  debug: '/debug',
  terms: '/terms',
  privacy: '/privacy',
};

export const MainContent: FC = () => {
  const web3 = useWeb3();
  const { location } = useRouterState();
  const prevPathnameRef = useRef('');
  const tokens = useTokens();
  const sdk = useCarbonInit();
  useScrollRestoration();
  useActivityNotifications();

  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      carbonEvents.general.changePage({ referrer: prevPathnameRef.current });

      prevPathnameRef.current = location.pathname;
    }
  }, [location, location.pathname]);

  if (
    location.pathname === paths.debug ||
    location.pathname === paths.terms ||
    location.pathname === paths.privacy
  ) {
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
