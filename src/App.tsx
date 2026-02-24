import { CreateStrategyCTAMobile } from 'components/strategies/create/CreateStrategyCTA';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { MainMenu, MobileMenu } from 'components/core/menu';
import { MainContent } from 'components/core/MainContent';
import { Toaster } from 'components/common/Toaster/Toaster';
import { Footer } from 'components/common/Footer/Footer';
import { SVGCarbonLogo } from 'components/common/SVGCarbonLogo';
import { SVGGradient } from 'components/common/SVGGradient';
import { useWagmi } from 'libs/wagmi';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';
import config from 'config';

export const App = () => {
  // Keep track of connection
  const { user, disconnect } = useWagmi();
  useEffect(() => {
    if (!config.policiesLastUpdated) return;
    const last = lsService.getItem('lastConnection');
    const lastPrivacy = new Date(config.policiesLastUpdated).getTime();
    if (!last || last < lastPrivacy) {
      // for some reason disconnect doesn't exist before 1s
      setTimeout(() => disconnect(), 1000);
    }
  }, [disconnect]);
  useEffect(() => {
    if (user) {
      lsService.setItem('lastConnection', Date.now());
    }
  }, [user]);

  return (
    <>
      <NotificationAlerts />
      <MainMenu />
      <main className="grid content-start grow">
        <MainContent />
      </main>
      <Footer />
      <MobileMenu />
      <ModalProvider />
      <Toaster />
      <CreateStrategyCTAMobile />
      <SVGCarbonLogo />
      <SVGGradient />
    </>
  );
};
