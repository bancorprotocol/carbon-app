import { forwardRef, JSX } from 'react';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconTokenPair } from 'assets/icons/token-pair.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useExplorerParams } from './useExplorerParams';
import { cn } from 'utils/helpers';

type ButtonAttributes = JSX.IntrinsicElements['button'];

export const ExplorerSearchDropdownButton = forwardRef<
  HTMLButtonElement,
  ButtonAttributes
>((props, ref) => {
  const { type } = useExplorerParams();
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className={cn(
        'flex items-center gap-10 font-weight-500',
        props.className
      )}
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
