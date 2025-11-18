import { CreateStrategyCTAMobile } from 'components/strategies/create/CreateStrategyCTA';
import { useCallback, useEffect, useRef } from 'react';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { MainMenu, MobileMenu } from 'components/core/menu';
import { MainContent } from 'components/core/MainContent';
import { useStore } from 'store';
import { Toaster } from 'components/common/Toaster/Toaster';
import { Footer } from 'components/common/Footer/Footer';
import { SVGCarbonLogo } from 'components/common/SVGCarbonLogo';
import { SVGGradient } from 'components/common/SVGGradient';
import { lsService } from 'services/localeStorage';
import { useModal } from 'hooks/useModal';
import { carbonApi } from 'utils/carbonApi';

export const App = () => {
  const { setCountryBlocked } = useStore();

  const { openModal } = useModal();
  const didInitCheck = useRef(false);

  const initCheck = useCallback(async () => {
    try {
      lsService.migrateItems();
      const isBlocked = await carbonApi.getCheck();
      setCountryBlocked(isBlocked);
      if (isBlocked && !lsService.getItem('hasSeenRestrictedCountryModal')) {
        openModal('restrictedCountry', undefined);
      }
    } catch (e) {
      console.error('Error carbonApi.getCheck', e);
    }
  }, [openModal, setCountryBlocked]);

  useEffect(() => {
    if (!didInitCheck.current) {
      didInitCheck.current = true;
      initCheck();
    }
  }, [initCheck]);

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
