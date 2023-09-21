import { FC } from 'react';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconTokenPair } from 'assets/icons/token-pair.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useExplorerParams } from './useExplorerParams';

interface Props {
  onClick: () => void;
}

export const ExplorerSearchDropdownButton: FC<Props> = ({ onClick }) => {
  const { type } = useExplorerParams();
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex items-center justify-between font-weight-500 md:w-[140px]'
      }
    >
      <span className={'flex items-center space-x-10'}>
        {type === 'wallet' && (
          <>
            <IconWallet className={'h-14 w-14 text-green'} />
            <span>Wallet</span>
          </>
        )}

        {type === 'token-pair' && (
          <>
            <IconTokenPair className={'h-18 w-18 text-green'} />
            <span>Token Pair</span>
          </>
        )}
      </span>
      <IconChevron className={'mt-4 ml-8 h-16 w-16 text-white/40'} />
    </button>
  );
};
