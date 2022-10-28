import { FC, ReactNode } from 'react';
import { MainMenuLeft } from './MainMenuLeft';
import { MainMenuRight } from './MainMenuRight';
import { IS_TENDERLY_FORK } from 'web3/web3.constants';
import { useWeb3 } from 'web3';
enum AlertType {
  ERROR,
  WARNING,
  INFO,
  PINK,
}

const getAlertColorClass = (type: AlertType) => {
  switch (type) {
    case AlertType.ERROR:
      return 'bg-red-500';
    case AlertType.WARNING:
      return 'bg-amber-500';
    case AlertType.INFO:
      return 'bg-sky-500';
    case AlertType.PINK:
      return 'bg-pink-500';
    default:
      return 'bg-green-500';
  }
};
const Alert: FC<{ children: ReactNode; type: AlertType }> = ({
  children,
  type,
}) => {
  return (
    <div
      className={`flex h-[24px] items-center justify-center ${getAlertColorClass(
        type
      )} text-sm font-bold text-white`}
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

const NetworkErrorAlert = () => {
  const { networkError } = useWeb3();
  return networkError ? (
    <Alert type={AlertType.ERROR}>Network Error: {networkError}</Alert>
  ) : null;
};

export const MainMenu: FC = () => {
  return (
    <div className={`sticky top-0`}>
      <TenderlyForkAlert />
      <ImposterAccountAlert />
      <NetworkErrorAlert />
      <div
        className={
          'bg-body px-content flex h-[79px] w-full items-center justify-between'
        }
      >
        <MainMenuLeft />
        <MainMenuRight />
      </div>
    </div>
  );
};
