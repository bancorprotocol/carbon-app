import { MainMenu, MobileMenu } from 'components/core/menu';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';
import { MainContent } from 'components/core/MainContent';

let didInit = false;

export const App = () => {
  const { init } = useCarbonSDK();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      void init();
    }
  }, [init]);

  return (
    <>
      <MainMenu />
      <main className={'flex-grow'}>
        <MainContent />
      </main>
      <MobileMenu />
      <NotificationAlerts />
      <ModalProvider />
    </>
  );
};
