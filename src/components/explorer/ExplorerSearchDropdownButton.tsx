import { forwardRef } from 'react';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconTokenPair } from 'assets/icons/token-pair.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useExplorerParams } from './useExplorerParams';
import { MenuButtonProps } from 'components/common/dropdownMenu';

export const ExplorerSearchDropdownButton = forwardRef<
  HTMLButtonElement,
  MenuButtonProps
>((props, ref) => {
  const { type } = useExplorerParams();
  return (
    <button
      ref={ref}
      type="button"
      className="flex items-center gap-10 font-weight-500"
      {...props}
    >
      {type === 'wallet' && (
        <>
          <IconWallet className="h-18 w-18 text-green" />
          <span className="hidden md:inline">Wallet</span>
        </>
      )}
      {type === 'token-pair' && (
        <>
          <IconTokenPair className="h-18 w-18 text-green" />
          <span className="hidden md:inline">Token Pair</span>
        </>
      )}
      <IconChevron className="h-16 w-16 text-white/40" />
    </button>
  );
});
