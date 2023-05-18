import { MainMenu, MobileMenu } from 'components/core/menu';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';
import { MainContent } from 'components/core/MainContent';
import { useStore } from 'store';

let didInit = false;

export const App = () => {
  const { setInnerHeight } = useStore();
  const { init } = useCarbonSDK();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      void init();
    }
  }, [init]);

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      // @ts-ignore
      const h = e.target?.innerHeight || 0;
      console.log(h);
      setInnerHeight(h);
    });
    return () => window.removeEventListener('resize', () => {});
  }, [setInnerHeight]);

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
