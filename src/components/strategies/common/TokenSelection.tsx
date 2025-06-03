import { useNavigate } from 'libs/routing';
import { TokenLogo } from 'components/common/imager/Imager';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { ReactComponent as ForwardArrowIcon } from 'assets/icons/arrow.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';
import { useTradeCtx } from 'components/trade/TradeContext';
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';
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
    <article className="bg-background-900 grid gap-16 rounded-se rounded-ss p-16">
      <div
        role="menu"
        className="relative grid grid-cols-2 place-items-center gap-20"
      >
        <button
          role="menuitem"
          className="rounded-12 pe-15 flex items-center gap-8 place-self-stretch border border-transparent bg-black py-5 ps-10 hover:border-white"
          aria-haspopup="dialog"
          data-testid="select-base-token"
          onClick={() => openTokenListModal('base')}
        >
          <TokenLogo token={base} size={30} className="hidden md:inline" />
          <p className="grid flex-1 text-start">
            <span className="font-weight-500 text-12 text-white/60">
              Buy or Sell
            </span>
            <span className="inline-flex items-center gap-4 break-all">
              {base.isSuspicious && <SuspiciousToken />}
              {base.symbol}
            </span>
          </p>
          <ChevronIcon className="ml-auto size-16" />
        </button>
        <button
          role="menuitem"
          className="border-background-900 hover:bg-background-800 absolute grid size-40 place-items-center rounded-full border-4 bg-black"
          onClick={swapTokens}
        >
          <ForwardArrowIcon className="size-14" />
        </button>
        <button
          role="menuitem"
          aria-haspopup="dialog"
          className="rounded-12 ps-15 flex items-center gap-8 place-self-stretch border border-transparent bg-black py-5 pe-10 hover:border-white"
          data-testid="select-quote-token"
          onClick={() => openTokenListModal('quote')}
        >
          <TokenLogo token={quote} size={30} className="hidden md:inline" />
          <p className="grid flex-1 text-start">
            <span className="font-weight-500 text-12 text-white/60">With</span>
            <span className="inline-flex items-center gap-4 break-all">
              {quote.isSuspicious && <SuspiciousToken />}
              {quote.symbol}
            </span>
          </p>
          <ChevronIcon className="ml-auto size-16" />
        </button>
      </div>
      <p className="text-14 flex items-center gap-8 text-white/60">
        <WarningIcon className="size-14" />
        Rebasing and fee-on-transfer tokens are not supported.
      </p>
    </article>
  );
};
