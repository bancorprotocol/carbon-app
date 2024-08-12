import { useNavigate } from 'libs/routing';
import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { TokenLogo } from 'components/common/imager/Imager';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { ReactComponent as ForwardArrowIcon } from 'assets/icons/arrow.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';

interface Props {
  base: Token;
  quote: Token;
}

export const TokenSelection: FC<Props> = ({ base, quote }) => {
  const navigate = useNavigate({ from: '/trade' });
  const { openModal } = useModal();

  const tokenEvent = (isSource = false, token: Token) => {
    const events = carbonEvents.strategy;
    if (isSource) {
      if (!base) events.newStrategyBaseTokenSelect({ token });
      else events.strategyBaseTokenChange({ token });
    } else {
      if (!quote) events.newStrategyQuoteTokenSelect({ token });
      else events.strategyQuoteTokenChange({ token });
    }
  };

  const openTokenListModal = (type: 'base' | 'quote') => {
    const isBase = type === 'base';
    const onClick = (token: Token) => {
      const search: { base?: string; quote?: string } = {};
      tokenEvent(isBase, token);

      if (isBase) {
        search.base = token.address;
        if (quote) search.quote = quote?.address;
      } else {
        if (base) search.base = base?.address;
        search.quote = token.address;
      }

      navigate({
        to: '/trade',
        search,
        replace: true,
        resetScroll: false,
      });
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [isBase ? quote?.address ?? '' : base?.address ?? ''],
      isBaseToken: isBase,
    };
    openModal('tokenLists', data);
  };

  const swapTokens = () => {
    if (base && quote) {
      carbonEvents.strategy.strategyTokenSwap({
        updatedBase: quote.symbol,
        updatedQuote: base.symbol,
      });
      navigate({
        to: '/trade',
        search: () => ({
          base: quote.address,
          quote: base.address,
        }),
        replace: true,
        resetScroll: false,
      });
    }
  };

  return (
    <div className="col-span-1 grid w-full grid-cols-2 gap-20">
      <button
        role="menuitem"
        className="bg-background-800 rounded-12 pe-15 flex items-center gap-8 py-5 ps-10"
        aria-haspopup="dialog"
        data-testid="select-base-token"
        onClick={() => openTokenListModal('base')}
      >
        <TokenLogo token={base} size={30} />
        {base.symbol}
        <ChevronIcon className="ml-auto size-16" />
      </button>
      <button
        role="menuitem"
        className="bg-background-800 absolute grid size-40 place-items-center place-self-center rounded-full border-4 border-black"
        onClick={swapTokens}
      >
        <ForwardArrowIcon className="size-14" />
      </button>
      <button
        role="menuitem"
        aria-haspopup="dialog"
        className="bg-background-800 rounded-12 ps-15 flex items-center gap-8 py-5 pe-10"
        data-testid="select-quote-token"
        onClick={() => openTokenListModal('quote')}
      >
        <TokenLogo token={quote} size={30} />
        {quote.symbol}
        <ChevronIcon className="ml-auto size-16" />
      </button>
    </div>
  );
};
