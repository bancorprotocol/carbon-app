import { MainMenu, MobileMenu } from 'components/core/menu';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect, useState } from 'react';
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

  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const innerHeight = window.innerHeight || 0;
      setInnerHeight(innerHeight);
      const doc = document.documentElement;
      // doc.style.setProperty(`--app-height`, `${innerHeight}px`);
    };
    window.addEventListener('resize', () => handleResize());
    return () => window.removeEventListener('resize', () => handleResize());
  }, []);

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
