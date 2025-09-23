import { useNavigate } from 'libs/routing';
import { TokenLogo } from 'components/common/imager/Imager';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { ReactComponent as ForwardArrowIcon } from 'assets/icons/arrow.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';
import { useTradeCtx } from 'components/trade/TradeContext';
import { SuspiciousToken } from 'components/common/DisplayPair';

export const TokenSelection = () => {
  const { base, quote } = useTradeCtx();
  const navigate = useNavigate({ from: '/trade' });
  const { openModal } = useModal();

  const openTokenListModal = (type: 'base' | 'quote') => {
    const isBase = type === 'base';
    const onClick = (token: Token) => {
      const search: { base?: string; quote?: string } = {};

      if (isBase) {
        search.base = token.address;
        if (quote) search.quote = quote?.address;
      } else {
        if (base) search.base = base?.address;
        search.quote = token.address;
      }

      navigate({
        search,
        replace: true,
        resetScroll: false,
      });
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [isBase ? (quote?.address ?? '') : (base?.address ?? '')],
      isBaseToken: isBase,
    };
    openModal('tokenLists', data);
  };

  const swapTokens = () => {
    if (base && quote) {
      navigate({
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
    <article
      role="menu"
      className="relative grid grid-cols-[1fr_auto_1fr] place-items-center gap-4 place-self-center rounded-full bg-white-gradient overflow-hidden p-4 animate-slide-up"
    >
      <button
        role="menuitem"
        className="rounded-full pe-15 flex items-center gap-8 place-self-stretch border border-transparent py-5 ps-10 hover:bg-black-gradient"
        aria-haspopup="dialog"
        data-testid="select-base-token"
        onClick={() => openTokenListModal('base')}
      >
        <TokenLogo token={base} size={30} className="hidden md:inline" />
        <p className="grid flex-1 text-start">
          <span className="font-medium text-12 text-white/60">Buy or Sell</span>
          <span className="inline-flex items-center gap-4 break-all">
            {base.isSuspicious && <SuspiciousToken />}
            {base.symbol}
          </span>
        </p>
        <ChevronIcon className="ml-auto size-16" />
      </button>
      <button
        role="menuitem"
        className="border-background-900 hover:bg-background-600 grid size-40 place-items-center rounded-full border-4 bg-black-gradient"
        onClick={swapTokens}
      >
        <ForwardArrowIcon className="size-14" />
      </button>
      <button
        role="menuitem"
        aria-haspopup="dialog"
        className="rounded-full ps-15 flex items-center gap-8 place-self-stretch border border-transparent py-5 pe-10 hover:bg-black-gradient"
        data-testid="select-quote-token"
        onClick={() => openTokenListModal('quote')}
      >
        <TokenLogo token={quote} size={30} className="hidden md:inline" />
        <p className="grid flex-1 text-start">
          <span className="font-medium text-12 text-white/60">With</span>
          <span className="inline-flex items-center gap-4 break-all">
            {quote.isSuspicious && <SuspiciousToken />}
            {quote.symbol}
          </span>
        </p>
        <ChevronIcon className="ml-auto size-16" />
      </button>
    </article>
  );
};
