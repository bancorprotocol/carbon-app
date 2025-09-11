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
      <main className="mb-16 grid content-start grow">
        <MainContent />
      </main>
      <Footer />
      <MobileMenu />
      <ModalProvider />
      <Toaster />
      <CreateStrategyCTAMobile />
      <SVGCarbonLogo />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="svg-brand-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="50%" stopColor="var(--color-secondary)" />
            <stop offset="100%" stopColor="var(--color-tertiary)" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};
