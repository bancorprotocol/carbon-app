import { MainMenu, MobileMenu } from 'components/core/menu';
import { NotificationAlerts } from 'libs/notifications';
import { ModalProvider } from 'libs/modals';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useEffect } from 'react';
import { MainContent } from 'components/core/MainContent';
import { useTranslation } from 'libs/translations';

let didInit = false;

export const App = () => {
  const { init } = useCarbonSDK();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      void init();
    }
  }, [init]);

  if (!i18n.isInitialized) {
    return null;
  }

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
