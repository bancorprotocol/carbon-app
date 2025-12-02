import IconWarning from 'assets/icons/warning.svg?react';
import { useWagmi } from 'libs/wagmi';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';
import config from 'config';

export const ErrorUnsupportedNetwork = () => {
  const { disconnect, switchNetwork } = useWagmi();

  const networkName = config.network.name;

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title="Wrong Network"
      text={`Please connect to ${networkName} using your wallet or the button below`}
      variant="error"
    >
      <button className="btn-primary-gradient" onClick={switchNetwork}>
        Change Network
      </button>
      <button className="btn-on-surface" onClick={disconnect}>
        Disconnect Wallet
      </button>
    </ErrorWrapper>
  );
};
