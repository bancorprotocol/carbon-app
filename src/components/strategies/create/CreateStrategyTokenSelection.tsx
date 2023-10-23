import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { m } from 'libs/motion';
import { PathNames, useNavigate } from 'libs/routing';
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
        to: PathNames.createStrategy,
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
      className="bg-secondary rounded-10 p-20"
      key="strategyCreateTokenSelection"
    >
      <header className="mb-15 flex items-center justify-between">
        <h2>Token Pair</h2>
        <Tooltip
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
      <div className="flex flex-col -space-y-15">
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
              className="relative z-10 mx-auto grid h-40 w-40 place-items-center rounded-full border-[5px] border-silver bg-black"
              onClick={swapTokens}
              disabled={!base || !quote}
            >
              <IconArrow className="h-12 w-12" />
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
