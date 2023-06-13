import { useEffect } from 'react';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { MainMenu, MobileMenu } from 'components/core/menu';
import { MainContent } from 'components/core/MainContent';

let didInit = false;

export const App = () => {
  const { init } = useCarbonInit();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      void init();
    }
  }, [init]);

  return (
    <>
      <NotificationAlerts />
      <MainMenu />
      <main className={'flex-grow'}>
        <MainContent />
      </main>
      <MobileMenu />
      <ModalProvider />
    </>
  );
};
