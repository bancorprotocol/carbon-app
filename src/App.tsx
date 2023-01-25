import { MainMenu, MobileMenu } from 'components/menu';
import { Outlet } from 'libs/routing';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';

export const App = () => {
  const { init } = useCarbonSDK();

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <>
      <MainMenu />
      <main>
        <Outlet />
      </main>
      <MobileMenu />
      <NotificationAlerts />
      <ModalProvider />
    </>
  );
};
