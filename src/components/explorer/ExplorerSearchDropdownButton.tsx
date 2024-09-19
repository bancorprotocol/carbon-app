import { forwardRef } from 'react';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconTokenPair } from 'assets/icons/token-pair.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useExplorerParams } from './useExplorerParams';
import { MenuButtonProps } from 'components/common/dropdownMenu';

export const ExplorerSearchDropdownButton = forwardRef<
  HTMLButtonElement,
  MenuButtonProps
>(function ExplorerSearchDropdownButton(props, ref) {
  const { type } = useExplorerParams('/explore/$type');
  return (
    <button
      ref={ref}
      type="button"
      className="font-weight-500 flex items-center gap-10"
      {...props}
    >
      {type === 'wallet' && (
        <>
          <IconWallet className="size-18 text-primary" />
          <span className="hidden md:inline">Wallet</span>
        </>
      )}
      {type === 'token-pair' && (
        <>
          <IconTokenPair className="size-18 text-primary" />
          <span className="hidden md:inline">Token Pair</span>
        </>
      )}
      <IconChevron className="size-16 text-white/40" />
    </button>
  );
});
