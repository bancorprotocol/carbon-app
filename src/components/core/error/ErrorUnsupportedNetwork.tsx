import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Button } from 'components/common/button';
import { useWeb3 } from 'libs/web3';
import { ErrorWrapper } from 'components/core/error/ErrorWrapper';

export const ErrorUnsupportedNetwork = () => {
  const { disconnect, switchNetwork } = useWeb3();

  return (
    <ErrorWrapper
      icon={<IconWarning />}
      title={'Wrong Network'}
      text={
        'Please connect to Ethereum Mainnet using your wallet or the button below'
      }
      variant={'error'}
    >
      <Button variant={'white'} fullWidth onClick={switchNetwork}>
        Change Network
      </Button>
      <Button variant={'black'} fullWidth onClick={disconnect}>
        Disconnect Wallet
      </Button>
    </ErrorWrapper>
  );
};
