import { FC, useEffect, useRef } from 'react';
import { useWagmi } from 'libs/wagmi';
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
import { useActivityToast } from 'components/activity/useActivityToast';

const paths: Record<string, Pathnames> = {
  debug: '/debug',
  terms: '/terms',
  privacy: '/privacy',
};

export const MainContent: FC = () => {
  const wagmi = useWagmi();
  const { location } = useRouterState();
  const prevPathnameRef = useRef('');
  const tokens = useTokens();
  const sdk = useCarbonInit();
  useScrollRestoration();
  useActivityNotifications();
  useActivityToast();

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

  if (!wagmi.isSupportedNetwork) {
    return <ErrorUnsupportedNetwork />;
  }

  if (wagmi.networkError) {
    return <ErrorNetworkConnection />;
  }

  if (sdk.isError) {
    return <ErrorSDKStartSync />;
  }

  if (tokens.isError) {
    return <ErrorTokenList />;
  }

  if (wagmi.isUserBlocked) {
    return <ErrorUserBlocked />;
  }

  return <Outlet />;
};
