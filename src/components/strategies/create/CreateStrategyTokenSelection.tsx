import { useNavigate } from 'libs/routing';
import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { items } from './variants';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';

export const CreateStrategyTokenSelection: FC<UseStrategyCreateReturn> = ({
  base,
  quote,
  openTokenListModal,
}) => {
  const navigate = useNavigate();

  const swapTokens = () => {
    if (base && quote) {
      carbonEvents.strategy.strategyTokenSwap({
        updatedBase: quote.symbol,
        updatedQuote: base.symbol,
      });
      navigate({
        to: '/strategies/create',
        search: (search) => ({
          ...search,
          base: quote.address,
          quote: base.address,
        }),
        replace: true,
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
              className="border-background-900 size-40 relative z-10 mx-auto grid place-items-center rounded-full border-[5px] bg-black"
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
