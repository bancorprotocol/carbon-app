import { FC, useEffect } from 'react';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { Token } from 'libs/tokens';
import { OverlappingMarketPriceProvider } from '../UserMarketPrice';
import { useSearch } from '@tanstack/react-router';
import { OverlappingOrder } from 'components/strategies/common/types';
import { isValidRange } from '../utils';
import { SetOverlapping } from 'libs/routing/routes/trade';
import { OverlappingPriceRange } from '../overlapping/OverlappingPriceRange';

interface Props {
  base: Token;
  quote: Token;
  marketPrice: string;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  spread: string;
  set: SetOverlapping;
}

const url = '/trade/overlapping';
export const CreateOverlappingPrice: FC<Props> = (props) => {
  const { base, quote, order0, order1, marketPrice, spread, set } = props;
  const search = useSearch({ from: url });
  const { anchor } = search;

  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);

  // WARNING
  const priceWarning = (() => {
    if (!aboveMarket && !belowMarket) return;
    return 'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';
  })();

  useEffect(() => {
    if (!isValidRange(order0.min, order1.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set({ anchor: 'sell', budget: undefined });
    }
    if (anchor === 'sell' && belowMarket) {
      set({ anchor: 'buy', budget: undefined });
    }
  }, [anchor, aboveMarket, belowMarket, set, order0.min, order1.max]);

  const setMin = (min: string) => set({ min });
  const setMax = (max: string) => set({ max });
  const setSpread = (spread: string) => set({ spread });

  const setAnchorValue = (value: 'buy' | 'sell') => {
    set({ anchor: value, budget: undefined });
  };

  if (!base || !quote) return null;

  return (
    <OverlappingMarketPriceProvider marketPrice={+marketPrice}>
      <article key="price-range" className="bg-background-900 grid gap-16 p-16">
        <header className="flex items-center gap-8">
          <h3 className="text-16 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="size-18 text-white/60"
          />
        </header>
        <OverlappingPriceRange
          base={base}
          quote={quote}
          min={order0.min}
          max={order1.max}
          setMin={setMin}
          setMax={setMax}
          minLabel="Min Buy Price"
          maxLabel="Max Sell Price"
          warnings={[priceWarning]}
          isOverlapping
          required
        />
      </article>
      <OverlappingSpread
        buyMin={Number(order0.min)}
        sellMax={Number(order1.max)}
        spread={spread}
        setSpread={setSpread}
      />
      <article className="bg-background-900 grid gap-16 p-16">
        <hgroup>
          <h3 className="text-16 font-weight-500 flex items-center justify-between">
            Budget
            <Tooltip
              iconClassName="size-18 text-white/60"
              element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
            />
          </h3>
          <p className="text-14 text-white/80">
            Please select a token to proceed.
          </p>
        </hgroup>
        <OverlappingAnchor
          base={base}
          quote={quote}
          anchor={anchor}
          setAnchor={setAnchorValue}
          disableBuy={aboveMarket}
          disableSell={belowMarket}
        />
      </article>
    </OverlappingMarketPriceProvider>
  );
};
