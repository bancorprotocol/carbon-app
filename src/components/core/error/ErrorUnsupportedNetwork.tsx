import { useWagmi } from 'libs/wagmi';
import { MainError } from './ErrorSDKStartSync';
import config from 'config';

export const ErrorUnsupportedNetwork = () => {
  const { disconnect, switchNetwork } = useWagmi();

  const networkName = config.network.name;

  return (
    <MainError
      title="Wrong Network"
      description={`Please connect to ${networkName} using your wallet or the button below`}
    >
      <div className="grid gap-16">
        <button className="btn-main-gradient" onClick={switchNetwork}>
          Change Network
        </button>
        <button className="btn-on-surface" onClick={disconnect}>
          Disconnect Wallet
        </button>
      </div>
    </MainError>
  );
};
