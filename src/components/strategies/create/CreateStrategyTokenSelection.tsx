import { useNavigate } from 'libs/routing';
import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { items } from 'components/strategies/common/variants';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';

interface Props {
  base?: Token;
  quote?: Token;
}

export const CreateStrategyTokenSelection: FC<Props> = ({ base, quote }) => {
  const navigate = useNavigate({ from: '/strategies/create' });
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

  const openTokenListModal = (isSource?: boolean) => {
    const onClick = (token: Token) => {
      const params: { base?: string; quote?: string } = {};
      tokenEvent(isSource, token);

      if (isSource) {
        params.base = token.address;
        if (quote) params.quote = quote?.address;
      } else {
        if (base) params.base = base?.address;
        params.quote = token.address;
      }

      navigate({
        search: (search) => ({
          ...search,
          ...params,
        }),
        replace: true,
        resetScroll: false,
      });
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [isSource ? quote?.address ?? '' : base?.address ?? ''],
      isBaseToken: isSource,
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
        search: (search) => ({
          ...search,
          base: quote.address,
          quote: base.address,
        }),
        replace: true,
        resetScroll: false,
      });
    }
  };

  return (
    <m.article
      variants={items}
      className="rounded-10 bg-background-900 p-20"
      key="strategyCreateTokenSelection"
    >
      <header className="mb-15 flex items-center justify-between">
        <h2>Token Pair</h2>
        <Tooltip
          iconClassName="text-white/60"
          sendEventOnMount={{ buy: undefined }}
          element={
            <div>
              Selecting the tokens you would like to create a strategy for.
              <br />
              <b>Buy or Sell token</b> (also called Base token) is the token you
              would like to buy or sell in the strategy.
              <br />
              <b>With token</b> (also called Quote token) is the token you would
              denominate the rates in.
            </div>
          }
        />
      </header>
      <div className="-space-y-15 flex flex-col">
        <SelectTokenButton
          symbol={base?.symbol}
          imgUrl={base?.logoURI}
          description="Buy or Sell"
          onClick={() => openTokenListModal(true)}
          isBaseToken
        />
        {!!base && (
          <>
            <button
              className="border-background-900 relative z-10 mx-auto grid size-40 place-items-center rounded-full border-[5px] bg-black"
              onClick={swapTokens}
              disabled={!base || !quote}
            >
              <IconArrow className="size-12" />
            </button>
            <SelectTokenButton
              symbol={quote?.symbol}
              imgUrl={quote?.logoURI}
              description="With"
              onClick={() => openTokenListModal()}
            />
          </>
        )}
      </div>
    </m.article>
  );
};
