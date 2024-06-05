import { ReactComponent as IconCoinbaseLogo } from 'assets/logos/coinbase.svg';
import { ReactComponent as IconCompassWalletLogo } from 'assets/logos/compassWallet.svg';
import { ReactComponent as IconTailwindWalletLogo } from 'assets/logos/tailwindWallet.svg';
import { ReactComponent as IconSeifWalletLogo } from 'assets/logos/seifWallet.svg';
import { ReactComponent as IconGnosisLogo } from 'assets/logos/gnosis.svg';
import { ReactComponent as IconImposterLogo } from 'assets/logos/imposter.svg';
import { ReactComponent as IconMetaMaskLogo } from 'assets/logos/metamask.svg';
import { ReactComponent as IconWalletConnectLogo } from 'assets/logos/walletConnect.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';

type Props = JSX.IntrinsicElements['img'] &
  JSX.IntrinsicElements['svg'] & {
    isImposter?: boolean;
    selectedWallet?: string;
    icon?: string;
  };
export const WalletIcon = ({
  isImposter,
  selectedWallet,
  icon,
  ...attr
}: Props) => {
  if (isImposter) {
    return <IconImposterLogo {...attr} />;
  }

  // For EIP6963 injected wallets
  if (icon) return <img alt="Wallet Logo" src={icon} {...attr} />;

  switch (selectedWallet) {
    case 'MetaMask':
      return <IconMetaMaskLogo {...attr} />;
    case 'WalletConnect':
      return <IconWalletConnectLogo {...attr} />;
    case 'Coinbase Wallet':
      return <IconCoinbaseLogo {...attr} />;
    case 'Safe':
      return <IconGnosisLogo {...attr} />;
    case 'Tailwind Wallet':
      return <IconTailwindWalletLogo {...attr} />;
    case 'Compass Wallet':
      return <IconCompassWalletLogo {...attr} />;
    case 'Seif Wallet':
      return <IconSeifWalletLogo {...attr} />;
    default:
      return <IconWallet {...attr} />;
  }
};
