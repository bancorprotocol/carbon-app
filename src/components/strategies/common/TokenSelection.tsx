import { useNavigate, useSearch } from 'libs/routing';
import { TokenLogo } from 'components/common/imager/Imager';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { ReactComponent as ForwardArrowIcon } from 'assets/icons/arrow.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';
import { SuspiciousToken } from 'components/common/DisplayPair';
import { FC, useMemo } from 'react';
import { useTokens } from 'hooks/useTokens';

interface Props {
  url: '/trade' | '/simulate';
}

export const TokenSelection: FC<Props> = ({ url }) => {
  const { getTokenById } = useTokens();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const { openModal } = useModal();

  const base = useMemo(
    () => getTokenById(search.base),
    [getTokenById, search.base],
  );
  const quote = useMemo(
    () => getTokenById(search.quote),
    [getTokenById, search.quote],
  );

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
      className="relative grid grid-cols-[1fr_auto_1fr] place-items-center gap-4 place-self-center rounded-full surface p-4 animate-slide-up"
    >
      <button
        role="menuitem"
        className="rounded-full pe-15 flex items-center gap-8 place-self-stretch border border-transparent py-5 ps-10 hover:bg-main-800"
        aria-haspopup="dialog"
        data-testid="select-base-token"
        onClick={() => openTokenListModal('base')}
      >
        <DisplayToken token={base} label="Buy or Sell" />
      </button>
      <button
        role="menuitem"
        className="bg-black hover:bg-black/60 active:scale-90 grid size-40 place-items-center rounded-full"
        onClick={swapTokens}
      >
        <ForwardArrowIcon className="size-14" />
      </button>
      <button
        role="menuitem"
        aria-haspopup="dialog"
        className="rounded-full ps-15 flex items-center gap-8 place-self-stretch border border-transparent py-5 pe-10 hover:bg-main-800"
        data-testid="select-quote-token"
        onClick={() => openTokenListModal('quote')}
      >
        <DisplayToken token={quote} label="With" />
      </button>
    </article>
  );
};

interface DisplayTokenProps {
  token?: Token;
  label: string;
}
const DisplayToken: FC<DisplayTokenProps> = ({ token, label }) => {
  return (
    <>
      <TokenLogo token={token} size={30} className="hidden sm:inline" />
      <p className="grid flex-1 text-start">
        <span className="font-medium text-12 text-white/60">{label}</span>
        <span className="inline-flex items-center gap-4 break-all min-h-24">
          {token?.isSuspicious && <SuspiciousToken />}
          {token?.symbol}
        </span>
      </p>
      <ChevronIcon className="ml-auto size-16" />
    </>
  );
};
