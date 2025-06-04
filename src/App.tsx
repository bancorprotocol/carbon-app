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
import { SVGCarbonLogo } from 'components/common/SVGCarbonLogo';

let didInitCheck = false;
let didInitSDK = false;

export const App = () => {
  const { initCheck, initSDK } = useCarbonInit();
  const { setInnerHeight } = useStore();

  const match = useMatchRoute();
  // Add more routes here to skip SDK init
  const skipSDKInit = [match({ to: '/simulate', fuzzy: true })].some(
    (x) => !!x,
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
    const handler = (e: UIEvent) => {
      const h = (e.target as Window)?.innerHeight || 0;
      setInnerHeight(h);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [setInnerHeight]);

  return (
    <>
      <NotificationAlerts />
      <MainMenu />
      <main className="mb-16 grid flex-grow">
        <MainContent />
      </main>
      <Footer />
      <MobileMenu />
      <ModalProvider />
      <Toaster />
      <CreateStrategyCTAMobile />
      <SVGCarbonLogo />
    </>
  );
};
