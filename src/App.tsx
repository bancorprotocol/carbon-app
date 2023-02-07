import { MainMenu, MobileMenu } from 'components/core/menu';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';
import { MainContent } from 'components/core/MainContent';

export const App = () => {
  const { init } = useCarbonSDK();

  useEffect(() => {
    void init();
  }, [init]);

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
