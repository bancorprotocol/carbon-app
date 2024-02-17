import { CreateStrategyCTAMobile } from 'components/strategies/create/CreateStrategyCTA';
import { useEffect } from 'react';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { MainMenu, MobileMenu } from 'components/core/menu';
import { MainContent } from 'components/core/MainContent';
import { useStore } from 'store';
import { Toaster } from 'components/common/Toaster/Toaster';
import { Footer } from 'components/common/Footer/Footer';
import { isNativeApp, isProduction } from 'utils/helpers';

let didInit = false;

export const App = () => {
  const { init } = useCarbonInit();
  const { setInnerHeight } = useStore();

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
      setInnerHeight(h);
    });
    return () => window.removeEventListener('resize', () => {});
  }, [setInnerHeight]);

  return (
    <>
      <NotificationAlerts />
      <MainMenu />
      <main className="mt-80 mb-16 flex w-full flex-grow flex-col">
        <MainContent />
      </main>
      {!isNativeApp && isProduction && <Footer />}
      <MobileMenu />
      <ModalProvider />
      <Toaster />
      <CreateStrategyCTAMobile />
    </>
  );
};
