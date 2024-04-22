import { useMatchRoute } from '@tanstack/react-router';
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

let didInitCheck = false;
let didInitSDK = false;

export const App = () => {
  const { initCheck, initSDK } = useCarbonInit();
  const { setInnerHeight } = useStore();

  const match = useMatchRoute();
  const skipSDKInit = [match({ to: '/simulate', fuzzy: true })].some(
    (x) => !!x
  );

  useEffect(() => {
    if (!didInitCheck) {
      didInitCheck = true;
      void initCheck();
    }
  }, [initCheck]);

  useEffect(() => {
    if (!didInitSDK && !skipSDKInit) {
      didInitSDK = true;
      void initSDK();
    }
  }, [initSDK, skipSDKInit]);

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
      <main className="mb-16 mt-80 flex w-full flex-grow flex-col">
        <MainContent />
      </main>
      <Footer />
      <MobileMenu />
      <ModalProvider />
      <Toaster />
      <CreateStrategyCTAMobile />
    </>
  );
};
