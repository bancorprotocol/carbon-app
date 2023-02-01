import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Button } from 'components/common/button';
import { useWeb3 } from 'libs/web3';

export const ErrorUnsupportedNetwork = () => {
  const { disconnect, switchNetwork } = useWeb3();
  return (
    <div
      className={
        'mx-auto mt-100 w-[385px] space-y-16 rounded-10 bg-silver p-20'
      }
    >
      <IconTitleText
        icon={<IconWarning />}
        title={'Wrong Network'}
        text={
          'Please connect to a supported network in the dropdown menu or in your wallet'
        }
        variant={'error'}
      />
      <Button variant={'white'} fullWidth onClick={switchNetwork}>
        Change Network
      </Button>
      <Button variant={'black'} fullWidth onClick={disconnect}>
        Disconnect Wallet
      </Button>
    </div>
  );
};
