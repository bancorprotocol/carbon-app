import { CreateStrategyCTAMobile } from 'components/strategies/create/CreateStrategyCTA';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { MainMenu, MobileMenu } from 'components/core/menu';
import { MainContent } from 'components/core/MainContent';
import { Toaster } from 'components/common/Toaster/Toaster';
import { Footer } from 'components/common/Footer/Footer';
import { SVGCarbonLogo } from 'components/common/SVGCarbonLogo';
import { SVGGradient } from 'components/common/SVGGradient';

export const App = () => {
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
