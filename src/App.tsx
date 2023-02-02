import { MainMenu, MobileMenu } from 'components/menu';
import { Outlet, PathNames } from 'libs/routing';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { ErrorUnsupportedNetwork } from 'components/error/ErrorUnsupportedNetwork';
import { ErrorNetworkConnection } from 'components/error/ErrorNetworkConnection';
import { useLocation } from '@tanstack/react-location';

export const App = () => {
  const { init } = useCarbonSDK();
  const { isSupportedNetwork, networkError } = useWeb3();
  const {
    current: { pathname },
  } = useLocation();

  const isDebugPage = pathname === PathNames.debug;

  useEffect(() => {
    void init();
  }, [init]);

  const MainContent = () => {
    if (isDebugPage) {
      return <Outlet />;
    }

    if (!isSupportedNetwork) {
      return <ErrorUnsupportedNetwork />;
    }

    if (networkError) {
      return <ErrorNetworkConnection />;
    }

    return <Outlet />;
  };

  return (
    <>
      <MainMenu />
      <main>
        <MainContent />
      </main>
      <MobileMenu />
      <NotificationAlerts />
      <ModalProvider />
    </>
  );
};
