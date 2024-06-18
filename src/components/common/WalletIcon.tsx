import { ReactComponent as IconCoinbaseLogo } from 'assets/logos/coinbase.svg';
import { ReactComponent as IconCompassWalletLogo } from 'assets/logos/compassWallet.svg';
import { ReactComponent as IconTailwindWalletLogo } from 'assets/logos/tailwindWallet.svg';
import { ReactComponent as IconSeifWalletLogo } from 'assets/logos/seifWallet.svg';
import { ReactComponent as IconGnosisLogo } from 'assets/logos/gnosis.svg';
import { ReactComponent as IconImposterLogo } from 'assets/logos/imposter.svg';
import { ReactComponent as IconMetaMaskLogo } from 'assets/logos/metamask.svg';
import { ReactComponent as IconWalletConnectLogo } from 'assets/logos/walletConnect.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';

type Props = {
  isImposter?: boolean;
  selectedWallet?: string;
  icon?: string;
  className?: string;
};
export const WalletIcon = ({
  isImposter,
  selectedWallet,
  icon,
  className,
}: Props) => {
  if (isImposter) {
    return <IconImposterLogo className={className} />;
  }

  // For EIP6963 injected wallets
  if (icon) {
    return (
      <img
        alt="Injected Wallet"
        loading="lazy"
        src={icon}
        className={className}
      />
    );
  }

  switch (selectedWallet) {
    case 'MetaMask':
      return <IconMetaMaskLogo className={className} />;
    case 'WalletConnect':
      return <IconWalletConnectLogo className={className} />;
    case 'Coinbase Wallet':
      return <IconCoinbaseLogo className={className} />;
    case 'Safe':
      return <IconGnosisLogo className={className} />;
    case 'Tailwind Wallet':
      return <IconTailwindWalletLogo className={className} />;
    case 'Compass Wallet':
      return <IconCompassWalletLogo className={className} />;
    case 'Seif Wallet':
      return <IconSeifWalletLogo className={className} />;
    default:
      return <IconWallet className={className} />;
  }
};
