import { MainMenu, MobileMenu } from 'components/menu';
import { Outlet } from 'libs/routing';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { ErrorUnsupportedNetwork } from 'components/error/ErrorUnsupportedNetwork';

export const App = () => {
  const { init } = useCarbonSDK();
  const { isSupportedNetwork } = useWeb3();

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <>
      <MainMenu />
      <main>
        {isSupportedNetwork ? <Outlet /> : <ErrorUnsupportedNetwork />}
      </main>
      <MobileMenu />
      <NotificationAlerts />
      <ModalProvider />
    </>
  );
};
