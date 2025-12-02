import IconCoinbaseLogo from 'assets/logos/coinbase.svg?react';
import IconCompassWalletLogo from 'assets/logos/compassWallet.svg?react';
import IconTailwindWalletLogo from 'assets/logos/tailwindWallet.svg?react';
import IconSeifWalletLogo from 'assets/logos/seifWallet.svg?react';
import IconGnosisLogo from 'assets/logos/gnosis.svg?react';
import IconImposterLogo from 'assets/logos/imposter.svg?react';
import IconMetaMaskLogo from 'assets/logos/metamask.svg?react';
import IconWalletConnectLogo from 'assets/logos/walletConnect.svg?react';
import IconWallet from 'assets/icons/wallet.svg?react';

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
