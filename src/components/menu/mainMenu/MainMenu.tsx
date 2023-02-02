import { FC, ReactNode } from 'react';
import { MainMenuLeft } from './MainMenuLeft';
import { MainMenuRight } from './MainMenuRight';
import { IS_TENDERLY_FORK } from 'libs/web3/web3.constants';
import { useWeb3 } from 'libs/web3';
import { MainMenuTokens } from 'components/menu/mainMenu/MainMenuTokens';
import { MainMenuSettings } from 'components/menu/mainMenu/MainMenuSettings';
import { useTrade } from 'components/trade/useTrade';

enum AlertType {
  ERROR,
  WARNING,
  INFO,
  PINK,
}

const getAlertColorClass = (type: AlertType) => {
  switch (type) {
    case AlertType.ERROR:
      return 'bg-red';
    case AlertType.WARNING:
      return 'bg-amber-500';
    case AlertType.INFO:
      return 'bg-sky-500';
    case AlertType.PINK:
      return 'bg-pink-500';
    default:
      return 'bg-green';
  }
};
const Alert: FC<{ children: ReactNode; type: AlertType }> = ({
  children,
  type,
}) => {
  return (
    <div
      className={`flex h-24 items-center justify-center ${getAlertColorClass(
        type
      )} text-14 font-weight-700 text-white`}
    >
      {children}
    </div>
  );
};

const TenderlyForkAlert = () => {
  return IS_TENDERLY_FORK ? (
    <Alert type={AlertType.PINK}>Tenderly Fork - ACTIVE</Alert>
  ) : null;
};

const ImposterAccountAlert = () => {
  const { isImposter } = useWeb3();
  return isImposter ? (
    <Alert type={AlertType.INFO}>Imposter Account - ACTIVE</Alert>
  ) : null;
};

export const MainMenu: FC = () => {
  const { baseToken, quoteToken, isTradePage } = useTrade();

  return (
    <div className={`sticky top-0 z-40`}>
      <TenderlyForkAlert />
      <ImposterAccountAlert />
      <div className={'main-menu'}>
        <MainMenuLeft />
        {!(!isTradePage || !baseToken || !quoteToken) && (
          <div className={'flex space-x-5'}>
            <MainMenuTokens />
            <MainMenuSettings />
          </div>
        )}

        <MainMenuRight />
      </div>
    </div>
  );
};
